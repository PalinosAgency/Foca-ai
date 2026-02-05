import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Cabeçalhos para evitar erros de CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { name, email, phone, password } = req.body;

  // Validação simples
  if (!email || !password || !name) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    // 1. Verifica se o e-mail já existe
    const userCheck = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    // 2. Criptografa a senha (Segurança máxima)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Cria token de verificação
    const verificationToken = uuidv4();

    // 4. Salva no Banco de Dados
    // Ajuste as colunas conforme sua tabela real no banco
    const newUser = await pool.query(
      `INSERT INTO users (name, email, phone, password, verification_token, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) 
       RETURNING id, name, email`,
      [name, email, phone, hashedPassword, verificationToken]
    );

    // Sucesso!
    return res.status(201).json({ 
      message: 'Usuário criado com sucesso!',
      user: newUser.rows[0]
    });

  } catch (error) {
    console.error('[ERRO NO REGISTRO]', error);
    return res.status(500).json({ message: 'Erro interno ao criar conta.' });
  }
}