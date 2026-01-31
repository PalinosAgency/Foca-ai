import pool from '../../lib/db.js';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // 1. Configuração de CORS (Essencial para evitar bloqueios de navegador)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  // Responde imediatamente a requisições OPTIONS (Pre-flight do navegador)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 2. Verificar Autenticação
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error('Token de autenticação não fornecido no cabeçalho.');
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error('Variável de ambiente JWT_SECRET não configurada no servidor.');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // 3. Receber dados
    const { name, phone, avatar_url } = req.body;

    console.log(`[UPDATE] Iniciando atualização para UserID: ${userId}`);

    // 4. Atualizar no Banco
    // CORREÇÃO AQUI: Removemos "updated_at = NOW()" pois a coluna não existe
    await pool.query(
      `UPDATE users 
       SET name = COALESCE($1, name), 
           phone = COALESCE($2, phone),
           avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4`,
      [name, phone, avatar_url, userId]
    );

    // 5. Retornar usuário atualizado
    const result = await pool.query(
      'SELECT id, name, email, phone, avatar_url, is_verified FROM users WHERE id = $1', 
      [userId]
    );
    
    if (result.rows.length === 0) {
      throw new Error('Usuário não encontrado após a atualização.');
    }
    
    return res.status(200).json({ 
      message: 'Perfil atualizado com sucesso',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('[ERRO CRÍTICO] Falha ao atualizar perfil:', error);
    
    return res.status(500).json({ 
      message: error.message || 'Erro desconhecido',
      detail: error.toString()
    });
  }
}