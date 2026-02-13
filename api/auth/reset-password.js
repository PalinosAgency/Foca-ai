import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { logError, logInfo } from '../../lib/logger.js';

export default async function handler(req, res) {
  // CORS


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

    // 2. Verificar validade (expiração)
    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({ message: 'Link expirado. Solicite um novo.' });
    }

    // CORREÇÃO: Removemos espaços da NOVA senha antes de salvar
    const cleanPassword = password.trim();

    // 3. Hash da nova senha limpa
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(cleanPassword, salt);

    // 4. Atualizar senha do usuário
    await pool.query(
      'UPDATE users SET password_hash = $1 WHERE id = $2',
      [passwordHash, record.user_id]
    );

    // 5. Limpar token usado
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    // ✅ Log de auditoria
    logInfo('Password Reset Completed', {
      userId: record.user_id,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });

    return res.status(200).json({ message: 'Senha alterada com sucesso!' });

  } catch (error) {
    logError('Reset Password Error', error);
    // Mensagem de erro mais detalhada para ajudar no debug se necessário
    return res.status(500).json({ message: `Erro interno: ${error.message}` });
  }
}