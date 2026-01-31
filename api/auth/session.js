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

    // CORREÇÃO CRÍTICA: Se o ID não for número, o token é antigo (da época do UUID).
    // Retornamos 401 para o frontend fazer logout automático.
    if (isNaN(Number(userData.id))) {
       throw new Error("Token legado inválido (ID não numérico)");
    }

    const userResult = await pool.query(
      'SELECT id, name, email, phone, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [userData.id]
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
    // Retornar 401 força o frontend a limpar o token
    return res.status(401).json({ message: 'Não autorizado ou Token expirado' });
  }
}