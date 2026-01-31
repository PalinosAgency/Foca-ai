import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // --- 1. CONFIGURAÇÃO DE SEGURANÇA (CORS) ---
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const user = verifyToken(req); // Pega o ID do usuário logado

    // Query segura
    const result = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount_cents ELSE 0 END), 0) as income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount_cents ELSE 0 END), 0) as expense
      FROM transactions 
      WHERE user_id = $1
    `, [user.id]);

    const income = parseInt(result.rows[0].income);
    const expense = parseInt(result.rows[0].expense);
    const balance = income - expense;

    return res.json({
      balance_cents: balance,
      income_cents: income,
      expense_cents: expense
    });

  } catch (error) {
    console.error("Erro financeiro:", error);
    // Retorna zeros para não quebrar a tela
    return res.json({ balance_cents: 0, income_cents: 0, expense_cents: 0 });
  }
}