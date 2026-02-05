import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // Configuração CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { email, password } = req.body;

  try {
    // 1. Forçar minúsculo para evitar erro de digitação
    const emailLower = email.toLowerCase();
    
    console.log(`[LOGIN ATTEMPT] Tentando logar: ${emailLower}`);

    // 2. Buscar usuário
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = result.rows[0];

    // --- DETETIVE DE LOGS ---
    if (!user) {
      console.log('[LOGIN FALHOU] Usuário não encontrado no banco.');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    console.log(`[LOGIN SUCESSO] Usuário encontrado: ID ${user.id}`);

    if (!user.password_hash) {
       console.log('[LOGIN FALHOU] Usuário sem senha (pode ser conta Google).');
       return res.status(401).json({ message: 'Esta conta usa login social ou senha inválida.' });
    }

    // 3. Comparar Senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isValid) {
      console.log('[LOGIN FALHOU] A senha digitada não bate com o hash do banco.');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 4. Sucesso!
    console.log('[LOGIN APROVADO] Gerando token...');
    
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
    console.error('[LOGIN CRITICAL ERROR]', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}