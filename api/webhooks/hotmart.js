import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

// Configurações
const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
// URL do seu n8n (Produção)
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // --- TRATAMENTO INTELIGENTE DA ESTRUTURA ---
  const body = req.body;
  console.log('[WEBHOOK HOTMART] Payload:', JSON.stringify(body).substring(0, 500)); 

  // 1. Extração de Dados
  const data = body.data || body; 
  
  // CORREÇÃO FEITA AQUI: Normaliza o email para evitar erro de maiúscula/minúscula
  const rawEmail = data.buyer?.email || data.email;
  // Se rawEmail existir, remove espaços e deixa minúsculo. Se não, fica null.
  const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
  
  // Extrai Status
  let statusRaw = 
    data.subscription?.status || 
    data.purchase?.status ||     
    data.status ||               
    '';
  
  const status = statusRaw.toUpperCase();

  // 2. Validação do Token
  const receivedToken = req.headers['x-hotmart-hottok'] || body.hottok || data.hottok;
  
  if (HOTMART_TOKEN && receivedToken && receivedToken !== HOTMART_TOKEN) {
    console.error('[WEBHOOK] Token Inválido:', receivedToken);
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  if (!email) {
    console.log('[WEBHOOK] Ignorado: Sem e-mail.');
    return res.status(200).send('Ignored: No Email');
  }

  try {
    // 3. Achar usuário
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`[WEBHOOK] Usuário não encontrado no banco: ${email}`);
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 4. LÓGICA DE APROVAÇÃO
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    if (isApproved) {
      console.log(`[WEBHOOK] Aprovado para ${email}. Ativando...`);

      // --- Atualização de Telefone ---
      let phoneToUpdate = null;
      let finalPhone = user.phone; 

      if (data.buyer?.checkout_phone) phoneToUpdate = data.buyer.checkout_phone;
      else if (data.buyer?.phone) phoneToUpdate = data.buyer.phone;
      else if (data.phone_checkout_number) phoneToUpdate = data.phone_checkout_number;

      if (phoneToUpdate) {
        let cleanPhone = phoneToUpdate.replace(/\D/g, '');
        if (cleanPhone.length <= 11 && !cleanPhone.startsWith('55')) cleanPhone = '55' + cleanPhone;
        if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

        if (cleanPhone !== user.phone) {
            await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [cleanPhone, user.id]);
            finalPhone = cleanPhone;
        }
      }

      // 5. Ativar Assinatura
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // 6. Enviar E-mail do Site (Boas-vindas)
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'Pagamento confirmado! Nosso agente entrará em contato.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });

      // 7. AVISAR O N8N
      try {
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: email,
                phone: finalPhone,
                status: 'approved',
                hotmart_original_status: status,
                origin: 'hotmart_webhook_v2_site'
            })
        });
      } catch (n8nError) {
        console.error('[WEBHOOK ERROR] n8n falhou:', n8nError);
      }
    }

    // Lógica de Cancelamento
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED', 'INACTIVE'].includes(status)) {
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );
      
      await sendEmail({
        to: email,
        subject: 'Sua assinatura foi cancelada 😢',
        title: 'Sentiremos sua falta!',
        message: 'Confirmamos o cancelamento.',
        buttonText: 'REATIVAR ASSINATURA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/'
      });
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}