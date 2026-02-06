import pool from '../lib/db.js';
import { verifyToken } from '../lib/auth.js';

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

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('[API ACCOUNT ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}