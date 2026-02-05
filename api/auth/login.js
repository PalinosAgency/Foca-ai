import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { email, password } = req.body;

  try {
    // 1. Verificações básicas
    if (!process.env.JWT_SECRET) {
        throw new Error('A variável JWT_SECRET não foi carregada na Vercel!');
    }

    const emailLower = email.toLowerCase();
    
    // 2. Busca Usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'E-mail não encontrado.' });
    }

    if (!user.password_hash) {
       return res.status(401).json({ message: 'Conta sem senha (use Login Google).' });
    }

    // 3. Compara Senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Senha incorreta.' });
    }

    // 4. Gera Token
    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('ERRO DETALHADO:', error);
    // AQUI ESTÁ O TRUQUE: Enviamos o erro real para o navegador
    return res.status(500).json({ 
        message: 'Erro interno identificado.',
        debug_error: error.message, // Vai mostrar o motivo exato
        stack: error.stack 
    });
  }
}