import pool from '../../lib/db.js';
import bcrypt from 'bcryptjs';
import { signToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  // CORS (Sempre necessário)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // 1. Verificar se o Body chegou
    if (!req.body) throw new Error('O corpo da requisição veio vazio.');
    const { email, password } = req.body;

    // 2. Verificar dados
    if (!email || !password) throw new Error(`Faltam dados. Email: ${email}, Senha: ${!!password}`);

    // 3. TESTE CRÍTICO DAS VARIÁVEIS
    // Se isto falhar, o erro vai aparecer na tua tela: "ERRO DEBUG: JWT_SECRET ausente..."
    if (!process.env.JWT_SECRET) {
        throw new Error('A variável JWT_SECRET não está sendo lida pelo código! Verifique se fez Redeploy.');
    }

    const emailLower = email.toLowerCase();

    // 4. Teste do Banco
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [emailLower]);
    const user = result.rows[0];

    if (!user) {
        // Retornamos 401 com mensagem clara
        return res.status(401).json({ message: `Usuário '${emailLower}' não encontrado no banco.` });
    }

    if (!user.password_hash) {
        return res.status(401).json({ message: 'Este usuário não tem senha (pode ser conta Google).' });
    }

    // 5. Teste da Senha
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
        return res.status(401).json({ message: 'A senha digitada está incorreta.' });
    }

    // 6. Teste do Token
    console.log('[DEBUG] Gerando token...');
    const token = signToken({ userId: user.id, email: user.email });

    return res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });

  } catch (error) {
    console.error('ERRO FATAL:', error);
    // AQUI ESTÁ A SOLUÇÃO: Enviamos o erro real para a mensagem que aparece no site
    return res.status(500).json({ 
        message: `ERRO DEBUG: ${error.message}` 
    });
  }
}