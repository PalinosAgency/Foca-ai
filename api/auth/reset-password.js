import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { token, password } = req.body;

  if (!token || !password) return res.status(400).json({ message: 'Dados incompletos.' });

  try {
    // 1. Validar Token
    const tokenResult = await pool.query(
      'SELECT * FROM password_reset_tokens WHERE token = $1',
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ message: 'Link inválido ou expirado.' });
    }

    const record = tokenResult.rows[0];

    // 2. Verificar validade
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ message: 'Link expirado. Solicite um novo.' });
    }

    // 3. Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Atualizar senha do usuário
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, record.user_id]
    );

    // 5. Limpar token usado
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    return res.status(200).json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    console.error('Erro no reset-password:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}