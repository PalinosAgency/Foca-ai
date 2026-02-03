import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const userData = verifyToken(req);

    // CORREÇÃO: Aceita 'id' OU 'userId' para compatibilidade
    const userId = userData.id || userData.userId;

    if (!userId || isNaN(Number(userId))) {
       throw new Error("Token inválido (ID não encontrado)");
    }

    const userResult = await pool.query(
      'SELECT id, name, email, phone, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ user: null, subscription: null });

    let subscription = null;
    try {
        const subResult = await pool.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 AND status = $2', 
            [user.id, 'active']
        );
        if (subResult.rows.length > 0) {
            subscription = subResult.rows[0];
        }
    } catch (e) {
        subscription = null;
    }

    return res.json({ user, subscription });

  } catch (error) {
    console.error("Erro na sessão:", error.message);
    return res.status(401).json({ message: 'Não autorizado ou Token expirado' });
  }
}