// api/auth/google-login.js
import pool from '../../lib/db.js'; // CORREÇÃO 1: Importar 'pool' (default), não '{ db }'
import { signToken } from '../../lib/auth.js'; 

export default async function handler(req, res) {
  // Configuração de CORS para evitar bloqueios no navegador
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Tratamento da requisição OPTIONS (Pre-flight do navegador)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(400).json({ message: 'Token de acesso não fornecido' });
  }

  try {
    // 1. Validar token no Google
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleResponse.ok) {
      throw new Error('Falha ao validar token com o Google');
    }

    const googleUser = await googleResponse.json();
    const { email, name, picture, sub: googleId } = googleUser;

    // 2. Verificar se usuário existe no banco
    // CORREÇÃO 2: Usar 'pool.query' em vez de 'db.query'
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // 3. Se não existir, CRIA
    if (!user) {
      // Gera uma senha aleatória segura, já que o login é social
      // (O usuário pode resetar depois se quiser entrar com senha)
      const randomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      // Inserção no banco
      const newUser = await pool.query( // CORREÇÃO: pool.query
        `INSERT INTO users (name, email, password_hash, avatar_url, google_id, is_verified, created_at) 
         VALUES ($1, $2, $3, $4, $5, true, NOW()) 
         RETURNING id, name, email, avatar_url, role`,
        [name, email, randomPass, picture, googleId]
      );
      user = newUser.rows[0];
    } else {
      // 4. Se já existe, atualiza a foto e vincula o ID do Google
      await pool.query( // CORREÇÃO: pool.query
        'UPDATE users SET avatar_url = $1, google_id = $2 WHERE id = $3',
        [picture, googleId, user.id]
      );
    }

    // 5. Gera o Token JWT da sua aplicação (Foca.aí)
    // Isso permite que o usuário continue logado no seu sistema
    const token = signToken({ 
      userId: user.id, 
      email: user.email,
      role: user.role || 'user' 
    });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Erro detalhado no Google Login:', error);
    return res.status(500).json({ 
      message: 'Erro interno ao processar login com Google',
      error: error.message 
    });
  }
}