import pool from '../../lib/db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';
import { logError, logInfo } from '../../lib/logger.js';

export default async function handler(req, res) {


  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email } = req.body;

  try {
    // CORREÇÃO: Remove espaços antes de procurar
    const emailLower = email.trim().toLowerCase();

    const userResult = await pool.query('SELECT id, name FROM users WHERE email = $1', [emailLower]);

    if (userResult.rows.length === 0) {
      // Retornamos 200 por segurança (para não revelar quais emails existem)
      return res.status(200).json({ message: 'Se o e-mail existir, enviamos o link.' });
    }

    const user = userResult.rows[0];
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

    // Insere o token no banco
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // ✅ Correção: usa APP_URL ao invés de NEXT_PUBLIC_APP_URL (server-side only)
    const appUrl = process.env.APP_URL || process.env.VERCEL_URL || 'https://foca-ai-oficial.vercel.app';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: emailLower,
      subject: 'Redefinição de Senha 🔒',
      title: 'Recuperar Senha',
      message: 'Clique abaixo para criar uma nova senha.',
      buttonText: 'Redefinir Senha',
      buttonLink: resetLink
    });

    // ✅ Log de auditoria
    logInfo('Password Reset Requested', {
      email: emailLower,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });

    return res.status(200).json({ message: 'E-mail enviado.' });

  } catch (error) {
    logError('Forgot Password Error', error);
    return res.status(500).json({ message: 'Erro interno ao processar pedido.' });
  }
}