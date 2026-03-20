import { signToken } from '../../lib/auth.js';
import { logError, logSecurityEvent } from '../../lib/logger.js';

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  // Credenciais admin via variáveis de ambiente
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS;

  if (!ADMIN_PASS) {
    logError('ADMIN_PASS não configurado nas variáveis de ambiente', null, { critical: true });
    return res.status(500).json({ message: 'Erro de configuração do servidor.' });
  }

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    logSecurityEvent('Admin Login Failed', {
      username,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });
    return res.status(401).json({ message: 'Credenciais inválidas.' });
  }

  try {
    // Gera JWT com role admin (expira em 24h)
    const token = signToken({ role: 'admin', username });

    logSecurityEvent('Admin Login Success', {
      username,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });

    return res.status(200).json({ token });
  } catch (error) {
    logError('Admin Login Error', error);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
}
