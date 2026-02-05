import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Headers CORS padrão
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, password } = req.body;

  try {
    const emailLower = email.toLowerCase();
    console.log(`[LOGIN] Tentativa para: ${emailLower}`);

    // 1. Busca usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = result.rows[0];

    if (!user) {
      console.log('[LOGIN] Usuário não encontrado.');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 2. Verifica Senha
    if (!user.password_hash) {
       console.log('[LOGIN] Conta sem senha (provável Login Social).');
       return res.status(401).json({ message: 'Use o login com Google.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      console.log('[LOGIN] Senha incorreta.');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Gera Token (Protegido)
    if (!process.env.JWT_SECRET) {
        console.error('CRÍTICO: JWT_SECRET não configurado na Vercel!');
        return res.status(500).json({ message: 'Erro de configuração no servidor.' });
    }

    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}