import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';
import { logError } from '../../lib/logger.js';

export default async function handler(req, res) {

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  // 1. Verificar autenticação (retorna 401 explicitamente, não 500)
  let userData;
  try {
    userData = verifyToken(req);
  } catch {
    return res.status(401).json({ message: 'Token inválido ou ausente.' });
  }

  const userId = userData?.userId || userData?.id;
  if (!userId) return res.status(401).json({ message: 'Token inválido ou ausente.' });

  // 2. Processar a requisição autenticada
  try {
    const userResult = await pool.query(
      'SELECT id, name, email, phone, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ user: null, subscription: null });

    // 2. Busca Assinatura
    let subscription = null;
    try {
      const subResult = await pool.query(
        'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
        [user.id]
      );

      if (subResult.rows.length > 0) {
        subscription = subResult.rows[0];

        // Se o status for "canceled" mas a data ainda estiver no futuro,
        // força o status para 'active' para o site liberar o acesso.
        const now = new Date();
        const expiresAt = subscription.current_period_end
          ? new Date(subscription.current_period_end)
          : null;

        if (expiresAt && expiresAt > now) {
          subscription.status = 'active';
        }
      }
    } catch (e) {
      logError('Erro ao buscar assinatura', e);
    }

    return res.json({ user, subscription });

  } catch (error) {
    logError('Erro na sessão', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}