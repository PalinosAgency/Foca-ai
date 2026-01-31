import pool from '../../lib/db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';

export default async function handler(req, res) {
  // Configuração CORS (Padrão para Backend Serverless)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;

  try {
    // 1. Verificar usuário
    const userRes = await pool.query('SELECT id, name, is_verified FROM users WHERE email = $1', [email]);
    const user = userRes.rows[0];

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado.' });
    if (user.is_verified) return res.status(400).json({ message: 'Este e-mail já está verificado.' });

    // 2. Gerar novo token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    // 3. Atualizar token no banco (Remove o antigo e põe o novo)
    await pool.query('DELETE FROM verification_tokens WHERE user_id = $1', [user.id]);
    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // 4. Enviar e-mail
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://focaai.vercel.app';
    const verificationLink = `${appUrl}/verify-email?token=${token}`;

    const emailSent = await sendEmail({
      to: email,
      subject: 'Foca.aí: Seu link de ativação chegou 🚀',
      title: `Olá, ${user.name}!`,
      message: 'Você solicitou o reenvio do link. Clique abaixo para ativar sua conta.',
      buttonText: 'Ativar Minha Conta',
      buttonLink: verificationLink
    });

    if (!emailSent) {
      return res.status(500).json({ message: 'Erro ao enviar e-mail. Tente novamente.' });
    }

    return res.status(200).json({ message: 'E-mail reenviado com sucesso!' });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}