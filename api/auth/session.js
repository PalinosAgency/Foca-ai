import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const userData = verifyToken(req);
    // Compatibilidade para userId ou id
    const userId = userData?.userId || userData?.id;

    if (!userId) throw new Error("ID de usuário não encontrado no token");

    // 1. Busca Usuário
    const userResult = await pool.query(
      'SELECT id, name, email, phone, avatar_url, is_verified, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];

    if (!user) return res.status(404).json({ user: null, subscription: null });

    // 2. Busca Assinatura (na tabela correta onde o Webhook grava)
    let subscription = null;
    try {
        const subResult = await pool.query(
            'SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', 
            [user.id]
        );
        
        if (subResult.rows.length > 0) {
            subscription = subResult.rows[0];

            // --- CORREÇÃO DE STATUS INTELIGENTE ---
            // Se o status for "canceled", mas a data ainda estiver no futuro,
            // nós FORÇAMOS o status para 'active' para o site liberar o acesso.
            const now = new Date();
            const expiresAt = subscription.current_period_end ? new Date(subscription.current_period_end) : null;

            if (expiresAt && expiresAt > now) {
                // O tempo ainda é válido, então visualmente é 'active'
                subscription.status = 'active';
            }
        }
    } catch (e) {
        console.error("Erro ao buscar assinatura:", e);
    }

    return res.json({ user, subscription });

  } catch (error) {
    console.error("Erro na sessão:", error.message);
    return res.status(401).json({ message: 'Não autorizado ou Token expirado' });
  }
}