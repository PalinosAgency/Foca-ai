import pool from '../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // 1. Configuração de CORS (Mantendo a sua configuração blindada)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 2. Autenticação Unificada (Serve para PUT e POST)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Token não fornecido.' });
    }
    
    const token = authHeader.split(' ')[1];
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET não configurado.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // ============================================================
    // CENÁRIO A: ATUALIZAR PERFIL (PUT) - Seu código original
    // ============================================================
    if (req.method === 'PUT') {
      const { name, phone, avatar_url } = req.body;

      console.log(`[ACCOUNT] Atualizando perfil: ${userId}`);

      await pool.query(
        `UPDATE users 
         SET name = COALESCE($1, name), 
             phone = COALESCE($2, phone),
             avatar_url = COALESCE($3, avatar_url)
         WHERE id = $4`,
        [name, phone, avatar_url, userId]
      );

      // Retorna dados atualizados
      const result = await pool.query(
        'SELECT id, name, email, phone, avatar_url FROM users WHERE id = $1', 
        [userId]
      );
      
      return res.status(200).json({ 
        message: 'Perfil atualizado com sucesso',
        user: result.rows[0]
      });
    }

    // ============================================================
    // CENÁRIO B: GERENCIAR ASSINATURA (POST) - Lógica Netflix
    // ============================================================
    if (req.method === 'POST') {
      const { action } = req.body; // 'cancel' ou 'reactivate'

      console.log(`[ACCOUNT] Gerenciando assinatura (${action}): ${userId}`);

      let autoRenewValue;
      if (action === 'cancel') autoRenewValue = false;
      else if (action === 'reactivate') autoRenewValue = true;
      else return res.status(400).json({ message: 'Ação inválida' });

      // Atualiza apenas a renovação, mantém o status active
      const result = await pool.query(
        `UPDATE subscriptions 
         SET auto_renew = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [autoRenewValue, userId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: 'Nenhuma assinatura encontrada para este usuário.' });
      }

      return res.status(200).json({ 
        message: action === 'cancel' ? 'Renovação cancelada.' : 'Assinatura reativada.',
        subscription: result.rows[0]
      });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('[API ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor', detail: error.message });
  }
}