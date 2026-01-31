import pool from '../../lib/db.js';

export default async function handler(req, res) {
  // CORS Headers (Igual aos outros arquivos)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { token } = req.body;

  if (!token) return res.status(400).json({ message: 'Token é obrigatório.' });

  try {
    // 1. Buscar o token no banco e verificar se não expirou
    const result = await pool.query(
      `SELECT * FROM verification_tokens 
       WHERE token = $1 
       AND expires_at > NOW()`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Link inválido ou expirado.' });
    }

    const verificationRecord = result.rows[0];
    const userId = verificationRecord.user_id;

    // 2. Atualizar o usuário para verificado
    await pool.query(
      'UPDATE users SET is_verified = TRUE WHERE id = $1',
      [userId]
    );

    // 3. Deletar o token usado (para não ser usado de novo)
    await pool.query(
      'DELETE FROM verification_tokens WHERE token = $1',
      [token]
    );

    return res.status(200).json({ message: 'E-mail verificado com sucesso!' });

  } catch (error) {
    console.error('Erro ao verificar e-mail:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}