import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Ajuste para seu domínio em produção
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    // 1. Segurança: Pega o usuário pelo Token (não confia no body)
    const user = verifyToken(req);
    if (!user) return res.status(401).json({ message: 'Não autorizado' });

    const { action } = req.body; // 'cancel' ou 'reactivate'

    let autoRenewValue;
    if (action === 'cancel') autoRenewValue = false;
    else if (action === 'reactivate') autoRenewValue = true;
    else return res.status(400).json({ message: 'Ação inválida' });

    // 2. Atualiza APENAS a renovação automática, mantendo o status 'active'
    // Assim o usuário continua acessando até o 'current_period_end'
    const result = await pool.query(
      `UPDATE subscriptions 
       SET auto_renew = $1, updated_at = NOW()
       WHERE user_id = $2
       RETURNING *`,
      [autoRenewValue, user.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Assinatura não encontrada.' });
    }

    return res.json({ 
      message: action === 'cancel' ? 'Renovação cancelada.' : 'Assinatura reativada.',
      subscription: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao gerenciar assinatura:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}