import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { name, email, phone, password } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Dados incompletos.' });
  }

  try {
    // 1. Verificar se usuário existe
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está cadastrado.' });
    }

    // 2. Criptografar senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = uuidv4();

    // 3. Inserir no Banco
    const newUser = await pool.query(
      `INSERT INTO users (name, email, phone, password, verification_token, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, name, email`,
      [name, email, phone, hashedPassword, verificationToken]
    );

    return res.status(201).json({ 
      message: 'Cadastro realizado com sucesso!',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('[REGISTER ERROR]', error);
    return res.status(500).json({ message: 'Erro interno ao criar conta.' });
  }
}