import pool from '../../lib/db.js';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email } = req.body;

  try {
    // 1. Verificar se usuário existe
    const userResult = await pool.query('SELECT id, name FROM users WHERE email = $1', [email]);
    
    // Segurança: Mesmo se não existir, retornamos sucesso para não revelar quais emails têm conta
    if (userResult.rows.length === 0) {
      return res.status(200).json({ message: 'Se o e-mail existir, as instruções foram enviadas.' });
    }

    const user = userResult.rows[0];

    // 2. Gerar token
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hora de validade

    // 3. Salvar na tabela de reset (Não na de verificação)
    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, token, expiresAt]
    );

    // 4. Enviar E-mail
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://focaai.vercel.app';
    const resetLink = `${appUrl}/reset-password?token=${token}`;

    await sendEmail({
      to: email,
      subject: 'Redefinição de Senha - Foca.aí 🔒',
      title: 'Esqueceu sua senha?',
      message: 'Não se preocupe, acontece com todo mundo. Clique no botão abaixo para escolher uma nova senha segura.',
      buttonText: 'Redefinir Minha Senha',
      buttonLink: resetLink
    });

    return res.status(200).json({ message: 'E-mail enviado.' });

  } catch (error) {
    console.error('Erro no forgot-password:', error);
    return res.status(500).json({ message: 'Erro interno.' });
  }
}