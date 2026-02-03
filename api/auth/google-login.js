import { db } from '../../lib/db.js';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { accessToken } = req.body;

  try {
    // 1. Validar token no Google
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleResponse.ok) throw new Error('Token Google inválido');

    const { email, name, picture, sub: googleId } = await googleResponse.json();

    // 2. Verificar se usuário existe
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // 3. Se não existir, CRIA
    if (!user) {
      // Senha aleatória pois é login social
      const randomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      
      const newUser = await db.query(
        `INSERT INTO users (name, email, password_hash, avatar_url, google_id, is_verified, created_at) 
         VALUES ($1, $2, $3, $4, $5, true, NOW()) 
         RETURNING id, name, email, avatar_url, role`,
        [name, email, randomPass, picture, googleId]
      );
      user = newUser.rows[0];
    } else {
      // Atualiza foto/ID se já existe
      await db.query(
        'UPDATE users SET avatar_url = $1, google_id = $2 WHERE id = $3',
        [picture, googleId, user.id]
      );
    }

    // 4. Gera Token JWT do Foca.aí
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
    console.error('Erro Google Login:', error);
    return res.status(401).json({ message: 'Falha ao autenticar com Google' });
  }
}