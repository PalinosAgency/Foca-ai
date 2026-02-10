import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Verificar Body
    if (!req.body) throw new Error('Body vazio');
    const { email, password } = req.body;

    // 2. Verificar dados básicos - ✅ Não loga dados sensíveis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
    }

    // 3. Verificar Variável de Ambiente (Causa comum de erro 500)
    if (!process.env.JWT_SECRET) {
      console.error('[CRITICAL] JWT_SECRET não configurado!');
      return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    }

    // 4. Tratamento do email
    const emailLower = email.trim().toLowerCase();

    // 5. Busca no Banco
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // 6. Verifica se tem senha (pode ser conta Google)
    if (!user.password_hash) {
      return res.status(401).json({ message: 'Conta criada via Google. Use o botão Google.' });
    }

    // 7. Comparação de Senha
    // Se a senha do reset vier com espaços e aqui não tiver trim (ou vice versa), falha.
    // O trim() garante que estamos comparando limpo com limpo.
    const isValid = await bcrypt.compare(password.trim(), user.password_hash);

    if (!isValid) {
      return res.status(401).json({ message: 'E-mail ou senha incorretos.' });
    }

    // 8. Geração do Token
    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    // ✅ Log detalhado apenas server-side (não exposto ao cliente)
    console.error('[LOGIN ERROR]', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    // ✅ Mensagem genérica para o cliente
    return res.status(500).json({
      message: 'Erro interno do servidor. Tente novamente mais tarde.'
    });
  }
}