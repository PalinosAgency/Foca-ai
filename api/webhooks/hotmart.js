import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
// URL do n8n (Agora enviando apenas números, sem o +)
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

// --- NOVA FUNÇÃO: PADRÃO APENAS NÚMEROS (SEM +) ---
function normalizePhone(phone) {
  if (!phone) return null;
  // Remove TUDO que não for número (+, -, espaço, parênteses)
  let clean = phone.replace(/\D/g, '');
  
  // Se parecer um número brasileiro sem DDI (10 ou 11 dígitos), adiciona 55
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  
  // Retorna APENAS números (ex: 5524999201036)
  return clean;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const body = req.body;
  
  // 1. SALVAR LOG (Segurança - para você ver o que a Hotmart mandou)
  try {
      await pool.query(
          'INSERT INTO webhook_logs (event_type, payload) VALUES ($1, $2)', 
          [body.event || 'UNKNOWN', JSON.stringify(body)]
      );
  } catch (e) { console.error('Erro ao salvar log', e); }

  const data = body.data || body; 
  
  // --- E-MAIL ---
  const rawEmail = data.buyer?.email || data.subscriber?.email || data.user?.email || data.email;
  const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
  
  // --- TELEFONE (Extração e Normalização para SEM +) ---
  let rawPhone = data.buyer?.checkout_phone || data.buyer?.phone || data.phone_checkout_number;
  if (!rawPhone && data.subscriber?.phone) {
     rawPhone = (data.subscriber.phone.ddd || '') + (data.subscriber.phone.number || '');
  }
  
  // Aqui a mágica acontece: converte para 5524999... (sem o +)
  const phone = normalizePhone(rawPhone); 

  // --- STATUS ---
  let statusRaw = data.subscription?.status || data.purchase?.status || data.status || '';
  if (body.event === 'SUBSCRIPTION_CANCELLATION') statusRaw = 'CANCELED';
  const status = statusRaw.toUpperCase();

  // Validação Token
  if (HOTMART_TOKEN) {
      const receivedToken = req.headers['x-hotmart-hottok'] || body.hottok || data.hottok;
      if (receivedToken && receivedToken !== HOTMART_TOKEN) {
        return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
      }
  }

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 2. BUSCA INTELIGENTE (Email OU Telefone)
    // Tenta achar o usuário pelo e-mail OU pelo telefone (agora que ambos estão sem + no banco)
    let userRes;
    
    if (phone) {
        userRes = await pool.query(
            'SELECT id, name, phone, email FROM users WHERE email = $1 OR phone = $2 LIMIT 1', 
            [email, phone]
        );
    } else {
        userRes = await pool.query(
            'SELECT id, name, phone, email FROM users WHERE email = $1 LIMIT 1', 
            [email]
        );
    }

    if (userRes.rows.length === 0) {
        console.log(`[WEBHOOK] Usuário não encontrado no banco: ${email}`);
        return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    // --- APROVAÇÃO ---
    if (isApproved) {
      console.log(`[WEBHOOK] Aprovado para ID: ${user.id}`);

      // Atualiza telefone no banco para o padrão novo (se estiver diferente)
      // Garante que o banco fique sempre atualizado com o número da compra (sem +)
      if (phone && user.phone !== phone) {
          await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, user.id]);
      }

      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      await sendEmail({
        to: email, 
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'Pagamento confirmado! Sua conta foi ativada com sucesso.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });
      
      // Envia para o n8n (com os dados limpos, sem +)
      try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: user.email, 
                phone: phone || user.phone, // Envia só números para o n8n
                status: 'approved',
                hotmart_original_status: status,
                origin: 'hotmart_webhook_v2_site'
            })
        });
      } catch (n8nError) {
        console.error('[WEBHOOK ERROR] n8n falhou:', n8nError);
      }
    }
    
    // --- CANCELAMENTO / REEMBOLSO ---
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED', 'INACTIVE'].includes(status)) {
      console.log(`[WEBHOOK] Término: ${status}`);
      
      let query = `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`;
      
      // Lógica de Reembolso: Corta acesso imediatamente voltando a data
      if (['REFUNDED', 'CHARGEBACK'].includes(status)) {
          query = `UPDATE subscriptions SET status = 'canceled', current_period_end = NOW() - INTERVAL '1 day' WHERE user_id = $1`;
      }
      
      await pool.query(query, [user.id]);
      
      // Só avisa se foi cancelamento voluntário (não reembolso)
      if (!['REFUNDED', 'CHARGEBACK'].includes(status)) {
         await sendEmail({
            to: email,
            subject: 'Sua assinatura foi cancelada',
            title: 'Cancelamento Confirmado',
            message: `Sua assinatura foi cancelada. Seu acesso continua válido até o fim do período pago.`,
            buttonText: 'Minha Conta',
            buttonLink: 'https://foca-ai-oficial.vercel.app/account'
         });
      }
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}