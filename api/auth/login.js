import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Em produção, esta chave deve vir do arquivo .env
const JWT_SECRET = process.env.JWT_SECRET || 'chave-secreta-padrao-dev';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método incorreto' });

  const { email, password } = req.body;

  try {
    // 1. Busca usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    // 2. Se não achar usuário
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Compara a senha
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 4. Gera o Token (O crachá de acesso)
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

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
    console.error('[ERRO NO LOGIN]', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
}