import pool from '../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Autenticação
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido.' });
    
    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET não configurado.');

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ============================================================
    // NOVO: CENÁRIO C - BUSCAR DADOS (GET)
    // ============================================================
    if (req.method === 'GET') {
      // Busca Assinatura atualizada
      const subResult = await pool.query(
        `SELECT status, plan_id, current_period_end, auto_renew 
         FROM subscriptions 
         WHERE user_id = $1`,
        [userId]
      );

      // Busca Dados do Usuário atualizados
      const userResult = await pool.query(
        `SELECT name, phone, email, avatar_url FROM users WHERE id = $1`,
        [userId]
      );

      return res.status(200).json({
        user: userResult.rows[0],
        subscription: subResult.rows[0] || null
      });
    }

    // ============================================================
    // CENÁRIO A: ATUALIZAR PERFIL (PUT)
    // ============================================================
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

    // ============================================================
    // CENÁRIO B: GERENCIAR ASSINATURA (POST)
    // ============================================================
    if (req.method === 'POST') {
      const { action } = req.body;
      let autoRenewValue = action === 'reactivate'; // true se reactivate, false se cancel

      const result = await pool.query(
        `UPDATE subscriptions 
         SET auto_renew = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [autoRenewValue, userId]
      );

      if (result.rowCount === 0) return res.status(404).json({ message: 'Assinatura não encontrada.' });

      return res.status(200).json({ 
        message: 'Atualizado com sucesso.',
        subscription: result.rows[0]
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}