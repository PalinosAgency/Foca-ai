import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { name, email, phone, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }

  try {
    // 1. Verifica duplicidade
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // 2. Criptografia
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // 3. Inserir Usuário (Status NÃO verificado)
    const newUser = await pool.query(
      `INSERT INTO users (name, email, phone, password_hash, is_verified, created_at) 
       VALUES ($1, $2, $3, $4, FALSE, NOW()) 
       RETURNING id, name, email`,
      [name, email, phone, hashedPassword]
    );
    
    const user = newUser.rows[0];

    // 4. Gerar Token e salvar na TABELA DE TOKENS (Correção para alinhar com verify-email.js)
    const verificationToken = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, verificationToken, expiresAt]
    );

    // 5. Enviar E-mail
    // Ajuste a URL para o seu domínio real se não for este
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://foca-ai-oficial.vercel.app';
    const verifyLink = `${appUrl}/verify-email?token=${verificationToken}`;

    const emailSent = await sendEmail({
      to: email,
      subject: 'Confirme sua conta no Foca.aí 🚀',
      title: `Bem-vindo(a), ${name}!`,
      message: 'Falta pouco para começares. Clique no botão abaixo para confirmar teu e-mail.',
      buttonText: 'CONFIRMAR MEU E-MAIL',
      buttonLink: verifyLink
    });

    if (!emailSent) {
      console.error('Falha ao enviar e-mail via Nodemailer.');
    }

    return res.status(201).json({ 
      message: 'Cadastro realizado! Verifique seu e-mail.',
      user: user
    });

  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao criar conta.' });
  }
}