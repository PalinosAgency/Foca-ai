import pool from '../../lib/db.js';
import { signToken } from '../../lib/auth.js';
import { logError } from '../../lib/logger.js';

export default async function handler(req, res) {
  // Configuração de CORS


  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { accessToken } = req.body;

  try {
    // 1. Validar token no Google
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleResponse.ok) throw new Error('Token Google inválido');

    const googleUser = await googleResponse.json();
    const { email, name, picture, sub: googleId } = googleUser;

    // 2. Verificar se usuário existe (usando pool.query)
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    let user = result.rows[0];

    // 3. Se não existir, CRIA
    if (!user) {
      const randomPass = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

      const newUser = await pool.query(
        `INSERT INTO users (name, email, password_hash, avatar_url, google_id, is_verified, created_at) 
         VALUES ($1, $2, $3, $4, $5, true, NOW()) 
         RETURNING id, name, email, avatar_url, role`,
        [name, email, randomPass, picture, googleId]
      );
      user = newUser.rows[0];
    } else {
      // Atualiza foto/ID se já existe
      await pool.query(
        'UPDATE users SET avatar_url = $1, google_id = $2 WHERE id = $3',
        [picture, googleId, user.id]
      );
    }

    // 4. Gera Token JWT
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
    logError('Google Login Error', error);
    return res.status(500).json({ message: 'Falha ao autenticar com Google', error: error.message });
  }
}