import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '../../lib/email.js';

export default async function handler(req, res) {
  // 1. Configuração de CORS (Permite que o site fale com o backend)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, password, phone } = req.body;

  try {
    console.log('[REGISTER] Iniciando:', email);

    // 2. Verificar se usuário existe
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // 3. Criar usuário
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await pool.query(
      'INSERT INTO users (name, email, password_hash, is_verified, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [name, email, passwordHash, false, phone]
    );
    const userId = newUser.rows[0].id;

    // 4. Gerar Token
    const token = uuidv4();
    // Data de expiração: hoje + 1 dia
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO verification_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [userId, token, expiresAt]
    );

    // 5. Tentar enviar E-mail (COM PROTEÇÃO TRY/CATCH)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://focaai.vercel.app';
    const verificationLink = `${appUrl}/verify-email?token=${token}`;

    try {
      await sendEmail({
        to: email,
        subject: 'Ative sua conta Foca.aí',
        title: `Olá, ${name}!`,
        message: 'Clique no botão abaixo para confirmar seu e-mail.',
        buttonText: 'Confirmar E-mail',
        buttonLink: verificationLink
      });
      console.log('[EMAIL] Enviado com sucesso');
    } catch (emailError) {
      // SE O E-MAIL FALHAR, O REGISTRO CONTINUA VÁLIDO
      console.error('[ERRO EMAIL] Falha ao enviar, mas usuário criado:', emailError.message);
    }

    // Retorna sucesso de qualquer forma
    return res.status(201).json({ 
      message: 'Conta criada com sucesso! (Verifique seu e-mail)' 
    });

  } catch (error) {
    console.error('[ERRO CRÍTICO]', error);
    return res.status(500).json({ 
      message: 'Erro interno no servidor.',
      detail: error.message 
    });
  }
}