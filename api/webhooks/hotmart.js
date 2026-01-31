import pool from '../../lib/db.js';

// AQUI ESTÁ A VARIÁVEL QUE VOCÊ ACABOU DE CONFIGURAR NA VERCEL
const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;

export default async function handler(req, res) {
  // Configuração de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;
  
  // Log para você ver no painel da Vercel quando uma venda acontecer
  console.log('[WEBHOOK HOTMART] Recebido:', JSON.stringify(data));

  // --- VERIFICAÇÃO DE SEGURANÇA ---
  // Se o token da Hotmart (hottok) não bater com o da Vercel, rejeitamos.
  if (HOTMART_TOKEN && data.hottok !== HOTMART_TOKEN) {
    console.error('[WEBHOOK] Token de segurança inválido!');
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  const email = data.email;
  // A Hotmart manda o status em maiúsculo (APPROVED), mas garantimos aqui
  const status = data.status ? data.status.toUpperCase() : ''; 

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 1. Achar o usuário
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.warn(`[WEBHOOK] Usuário não encontrado: ${email}`);
      return res.status(200).send('User not found'); 
    }

    const userId = userRes.rows[0].id;

    // 2. APROVADO: Liberar acesso Premium
    if (status === 'APPROVED' || status === 'COMPLETED') {
      console.log(`[WEBHOOK] Pagamento Aprovado: ${email}`);
      
      // Inserimos ou atualizamos a assinatura
      // Damos 35 dias de acesso para cobrir pequenos atrasos na renovação mensal
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [userId]
      );
    }

    // 3. CANCELADO/REEMBOLSADO: Remover acesso
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED'].includes(status)) {
      console.log(`[WEBHOOK] Acesso revogado: ${email}`);
      
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [userId]
      );
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}