import pool from '../../lib/db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';
import { logError, logInfo } from '../../lib/logger.js';

export default async function handler(req, res) {

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: 'E-mail é obrigatório.' });
  }

  try {
    const emailLower = email.trim().toLowerCase();

    const userResult = await pool.query('SELECT id, name FROM users WHERE email = $1', [emailLower]);

    if (userResult.rows.length === 0) {
      // Retornamos 200 por segurança (não revelar quais emails existem)
      return res.status(200).json({ message: 'Se o e-mail existir, enviamos o link.' });
    }

    const user = userResult.rows[0];
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    const appUrl = process.env.APP_URL || process.env.VERCEL_URL || 'https://www.focaaioficial.com';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    // sendEmail retorna false se EMAIL_USER/PASS não estão configurados — tratado graciosamente
    const sent = await sendEmail({
      to: emailLower,
      subject: 'Redefinição de Senha 🔒',
      title: 'Recuperar Senha',
      message: 'Clique abaixo para criar uma nova senha.',
      buttonText: 'Redefinir Senha',
      buttonLink: resetLink
    });

    if (!sent) {
      logError('sendEmail retornou false — EMAIL_USER/PASS não configurados ou falha SMTP', null);
    }

    logInfo('Password Reset Requested', {
      email: emailLower,
      sent,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });

    // Sempre retorna 200 para não revelar se email existe ou se envio funcionou (security by design)
    return res.status(200).json({ message: 'Se o e-mail existir, enviamos o link.' });

  } catch (error) {
    logError('Forgot Password Error', error);
    // Retorna 200 mesmo com erro — não revelar erros internos (security by design)
    return res.status(200).json({ message: 'Se o e-mail existir, enviamos o link.' });
  }
}