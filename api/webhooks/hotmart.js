import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const body = req.body;
  console.log('[WEBHOOK HOTMART] Payload:', JSON.stringify(body).substring(0, 1000)); 

  const data = body.data || body; 
  
  // CORREÇÃO: Busca e-mail em buyer, subscriber ou user
  const rawEmail = data.buyer?.email || data.subscriber?.email || data.user?.email || data.email;
  const email = rawEmail ? rawEmail.trim().toLowerCase() : null;
  
  let statusRaw = data.subscription?.status || data.purchase?.status || data.status || '';
  
  // Força status se for evento de cancelamento
  if (body.event === 'SUBSCRIPTION_CANCELLATION') statusRaw = 'CANCELED';
  
  const status = statusRaw.toUpperCase();

  const receivedToken = req.headers['x-hotmart-hottok'] || body.hottok || data.hottok;
  if (HOTMART_TOKEN && receivedToken && receivedToken !== HOTMART_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  if (!email) {
    console.log('[WEBHOOK] Ignorado: Sem e-mail.');
    return res.status(200).send('Ignored: No Email');
  }

  try {
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    if (userRes.rows.length === 0) return res.status(200).send('User not found'); 

    const user = userRes.rows[0];
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    if (isApproved) {
      console.log(`[WEBHOOK] Aprovado para ${email}. Ativando...`);

      let phoneToUpdate = null;
      let finalPhone = user.phone; 

      if (data.buyer?.checkout_phone) phoneToUpdate = data.buyer.checkout_phone;
      else if (data.buyer?.phone) phoneToUpdate = data.buyer.phone;
      else if (data.phone_checkout_number) phoneToUpdate = data.phone_checkout_number;
      else if (data.subscriber?.phone?.phone) {
         const ddd = data.subscriber.phone.dddPhone || '';
         const num = data.subscriber.phone.phone || '';
         phoneToUpdate = ddd + num;
      }

      if (phoneToUpdate) {
        let cleanPhone = phoneToUpdate.replace(/\D/g, '');
        if (cleanPhone.length <= 11 && !cleanPhone.startsWith('55')) cleanPhone = '55' + cleanPhone;
        if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

        if (cleanPhone !== user.phone) {
            await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [cleanPhone, user.id]);
            finalPhone = cleanPhone;
        }
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
        message: 'Pagamento confirmado! Nosso agente entrará em contato.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });

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
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED', 'INACTIVE'].includes(status)) {
      console.log(`[WEBHOOK] Cancelamento detectado para ${email}. Status: ${status}`);
      
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );
      
      await sendEmail({
        to: email,
        subject: 'Sua assinatura foi cancelada',
        title: 'Cancelamento Confirmado',
        message: `Recebemos a confirmação do cancelamento da sua assinatura. Seu acesso continua válido até o fim do período atual. Após essa data, será necessário realizar uma nova compra para continuar acessando.`,
        buttonText: 'Acessar Minha Conta',
        buttonLink: 'https://foca-ai-oficial.vercel.app/account'
      });
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}