import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;
  console.log('[WEBHOOK HOTMART] Recebido:', JSON.stringify(data));

  // Verificação de Segurança
  if (HOTMART_TOKEN && data.hottok && data.hottok !== HOTMART_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  const email = data.email;
  const status = data.status ? data.status.toUpperCase() : ''; 

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 1. Achar o usuário
    const userRes = await pool.query('SELECT id, name FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 2. APROVADO
    if (status === 'APPROVED' || status === 'COMPLETED') {
      
      // Atualizar Assinatura
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // CORREÇÃO AQUI: URL Atualizada
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'O pagamento foi confirmado e seu acesso Premium ao Foca.aí está liberado. Nosso agente inteligente entrará em contato pelo WhatsApp em instantes.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' // <-- URL CORRIGIDA
      });
    }

    // 3. CANCELADO
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED'].includes(status)) {
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}