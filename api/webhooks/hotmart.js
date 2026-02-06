import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

// --- PADRÃO APENAS NÚMEROS (SEM +) ---
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  return clean;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const body = req.body;
  
  // 1. LOG DE SEGURANÇA
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
  
  // --- TELEFONE (Só Números) ---
  let rawPhone = data.buyer?.checkout_phone || data.buyer?.phone || data.phone_checkout_number;
  if (!rawPhone && data.subscriber?.phone) {
     rawPhone = (data.subscriber.phone.ddd || '') + (data.subscriber.phone.number || '');
  }
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
    // 2. BUSCA DO USUÁRIO
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

    if (userRes.rows.length === 0) return res.status(200).send('User not found'); 

    const user = userRes.rows[0];
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    // --- APROVAÇÃO ---
    if (isApproved) {
      console.log(`[WEBHOOK] Aprovado para ID: ${user.id}`);

      // Atualiza telefone (se necessário)
      if (phone && user.phone !== phone) {
          await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, user.id]);
      }

      // --- LÓGICA DE TRIAL VS PAGAMENTO REAL ---
      // Verificamos o valor pago. Se for 0 ou nulo, é Trial.
      const pricePaid = data.purchase?.price?.value || data.price?.value || 0;
      
      // Se pagou algo (> 0.50), dá 35 dias. Se foi grátis (Trial), dá 4 dias.
      const daysToAdd = pricePaid > 0.5 ? 35 : 4; 
      
      // Calculamos a data exata aqui no JS para passar pro banco
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysToAdd);

      console.log(`[WEBHOOK] Valor pago: ${pricePaid}. Liberando acesso por ${daysToAdd} dias.`);

      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', $2)
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium'`,
        [user.id, endDate] // Passamos a data calculada
      );

      // Envia E-mail de Boas-vindas
      await sendEmail({
        to: email, 
        subject: daysToAdd > 10 ? 'Matrícula Confirmada! 🚀' : 'Período de Teste Iniciado! 🧪',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: daysToAdd > 10 
            ? 'Seu pagamento foi confirmado e sua conta premium está ativa.' 
            : 'Aproveite seus 3 dias de teste grátis com acesso total!',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });
      
      // Envia para o n8n
      try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: user.email, 
                phone: phone || user.phone,
                status: 'approved',
                is_trial: daysToAdd < 10, // Avisa o n8n se é trial
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
      
      // Se for reembolso, corta acesso IMEDIATAMENTE
      if (['REFUNDED', 'CHARGEBACK'].includes(status)) {
          query = `UPDATE subscriptions SET status = 'canceled', current_period_end = NOW() - INTERVAL '1 day' WHERE user_id = $1`;
      }
      // NOTA: Se for cancelamento normal (parou o trial), a data que definimos na aprovação (4 dias)
      // continua valendo. Então ele perde o acesso no dia 4 automaticamente. Perfeito.
      
      await pool.query(query, [user.id]);
      
      if (!['REFUNDED', 'CHARGEBACK'].includes(status)) {
         await sendEmail({
            to: email,
            subject: 'Sua assinatura foi cancelada',
            title: 'Cancelamento Confirmado',
            message: `Sua assinatura foi cancelada. Seu acesso continua válido até o fim do período atual.`,
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