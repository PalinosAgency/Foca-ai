import pool from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';
import { sendEmail } from '../lib/email.js'; // 1. Importação nova

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const userData = verifyToken(req);
    const userId = userData?.userId || userData?.id;

    if (!userId) return res.status(401).json({ message: 'Token inválido ou não fornecido.' });

    // --- GET: Buscar dados ---
    if (req.method === 'GET') {
      const subResult = await pool.query(
        `SELECT status, plan_id, current_period_end, auto_renew 
         FROM subscriptions 
         WHERE user_id = $1
         ORDER BY created_at DESC LIMIT 1`,
        [userId]
      );

      const userResult = await pool.query(
        `SELECT name, phone, email, avatar_url FROM users WHERE id = $1`,
        [userId]
      );

      return res.status(200).json({
        user: userResult.rows[0],
        subscription: subResult.rows[0] || null
      });
    }

    // --- PUT: Atualizar Perfil ---
    if (req.method === 'PUT') {
      const { name, phone, avatar_url } = req.body;
      await pool.query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             phone = COALESCE($2, phone),
             avatar_url = COALESCE($3, avatar_url)
         WHERE id = $4`,
        [name, phone, avatar_url, userId]
      );
      return res.status(200).json({ message: 'Perfil atualizado' });
    }

    // --- POST: Gerenciar Assinatura ---
    if (req.method === 'POST') {
      const { action } = req.body;
      // Define se liga ou desliga a renovação
      let autoRenewValue = action === 'reactivate';

      // 2. Busca dados do usuário antes de atualizar (precisamos do email e nome)
      const userRes = await pool.query('SELECT name, email FROM users WHERE id = $1', [userId]);
      const user = userRes.rows[0];

      // 3. Atualiza o banco
      const result = await pool.query(
        `UPDATE subscriptions 
         SET auto_renew = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [autoRenewValue, userId]
      );

      if (result.rowCount === 0) return res.status(404).json({ message: 'Assinatura não encontrada.' });
      
      const updatedSub = result.rows[0];

      // 4. DISPARAR E-MAIL DE REATIVAÇÃO
      // O Cancelamento seguro é feito via Hotmart (Webhook envia o email), 
      // mas a Reativação é feita aqui.
      if (user && action === 'reactivate') {
          await sendEmail({
            to: user.email,
            subject: 'Assinatura Reativada! 🎉',
            title: 'Bem-vindo(a) de volta!',
            message: `Olá, ${user.name}. Que bom ter você com a gente! Sua assinatura foi reativada e a renovação automática está ligada novamente.`,
            buttonText: 'Voltar aos Estudos',
            buttonLink: 'https://foca-ai-oficial.vercel.app/'
          });
          console.log(`[API ACCOUNT] Email de reativação enviado para ${user.email}`);
      }
      // Se fosse cancelamento via API (que desaconselhamos), o código de e-mail entraria aqui.
      // Mas como vamos usar o redirect, este bloco foca na reativação.

      return res.status(200).json({ 
        message: 'Atualizado com sucesso.',
        subscription: updatedSub
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('[API ACCOUNT ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}