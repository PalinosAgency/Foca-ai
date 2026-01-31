import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { identifier, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [identifier]);
    
    if (result.rows.length === 0) return res.status(400).json({ message: 'Credenciais inválidas.' });
    
    const user = result.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash);
    
    if (!validPass) return res.status(400).json({ message: 'Credenciais inválidas.' });
    
    if (!user.is_verified) return res.status(403).json({ message: 'Por favor, verifique seu e-mail antes de entrar.' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar_url: user.avatar_url,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno' });
  }
}