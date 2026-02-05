import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS Setup
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, password } = req.body;

  try {
    // 1. Buscar usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    // 2. Verificar senha (se o usuário tiver senha)
    if (!user.password) {
      return res.status(401).json({ message: 'Esta conta usa login social (Google).' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Credenciais inválidas.' });

    // 3. Gerar Token (Usando a mesma função que o Google Login usa)
    const token = signToken({ 
      userId: user.id, 
      email: user.email 
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });

  } catch (error) {
    console.error('[LOGIN ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}