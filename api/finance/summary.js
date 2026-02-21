import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';
import { logError } from '../../lib/logger.js';

export default async function handler(req, res) {

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // 1. Verificar autenticação (retorna 401 explicitamente, não 500/200)
  let user;
  try {
    user = verifyToken(req);
  } catch {
    return res.status(401).json({ message: 'Token inválido ou ausente.' });
  }

  if (!user?.id && !user?.userId) {
    return res.status(401).json({ message: 'Token inválido ou ausente.' });
  }

  const userId = user.id || user.userId;

  // 2. Processar requisição autenticada
  try {
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount_cents ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount_cents ELSE 0 END), 0) as expense
      FROM transactions 
      WHERE user_id = $1
    `, [userId]);

    const income = parseInt(result.rows[0].income);
    const expense = parseInt(result.rows[0].expense);
    const balance = income - expense;

    return res.json({
      balance_cents: balance,
      income_cents: income,
      expense_cents: expense
    });

  } catch (error) {
    logError('Finance Summary Error', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}