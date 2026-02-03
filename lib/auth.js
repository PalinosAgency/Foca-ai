import jwt from 'jsonwebtoken';

// --- ADICIONADO: Função para criar o token (Faltava isso!) ---
export function signToken(payload) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing in environment variables');
  }
  // Cria um token válido por 7 dias
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(req) {
  // 1. Tenta pegar o token do cabeçalho
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // 2. Se não tiver token, erro
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    // 3. Verifica se a senha do token bate com a do servidor
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is missing in environment variables');
    }
    
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid token');
  }
}