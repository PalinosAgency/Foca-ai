import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    
    const user = verifyToken(req);

    try {
        await pool.query(
            "UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1 AND status = 'active'",
            [user.id]
        );
    } catch (dbError) {
        console.error("Erro banco cancelamento:", dbError);
        
    }

    return res.json({ message: 'Assinatura cancelada com sucesso.' });

  } catch (error) {
    console.error('Erro ao cancelar:', error);
    return res.status(500).json({ message: 'Erro ao processar cancelamento.' });
  }
}