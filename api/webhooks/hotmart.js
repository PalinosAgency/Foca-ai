import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;
  console.log('[WEBHOOK HOTMART] Recebido:', JSON.stringify(data));

  // Verificação de Segurança (Token da Hotmart)
  if (HOTMART_TOKEN && data.hottok && data.hottok !== HOTMART_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  const email = data.email;
  const status = data.status ? data.status.toUpperCase() : ''; 

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 1. Achar o usuário pelo e-mail
    // Buscamos também o telefone atual para log de debug
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`[WEBHOOK] Usuário não encontrado para o email: ${email}`);
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 2. LÓGICA DE APROVAÇÃO
    if (status === 'APPROVED' || status === 'COMPLETED') {
      
      // --- CAPTURA E ATUALIZAÇÃO DO TELEFONE ---
      // Objetivo: Se o cliente colocou o telefone na compra, salvamos no perfil dele.
      let phoneToUpdate = null;

      // A Hotmart pode mandar o telefone de dois jeitos:
      if (data.phone_checkout_number) {
        // Formato completo (ex: 5511999999999)
        phoneToUpdate = data.phone_checkout_number;
      } else if (data.phone_number) {
        // Formato separado (DDD + Numero)
        const ddd = data.phone_local_code || '';
        const number = data.phone_number;
        phoneToUpdate = `55${ddd}${number}`; 
      }

      if (phoneToUpdate) {
        // Limpeza: remove espaços, traços e parênteses, deixa só números
        let cleanPhone = phoneToUpdate.replace(/\D/g, '');
        
        // Garante que tem o "+" no começo (Padrão internacional/WhatsApp)
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = `+${cleanPhone}`;
        }

        console.log(`[WEBHOOK] Atualizando telefone do usuário ${user.id} (${user.name}). De: ${user.phone} Para: ${cleanPhone}`);
        
        // AQUI ACONTECE A MÁGICA:
        // Atualizamos o telefone no banco. Isso cobre dois casos:
        // 1. Ele não tinha telefone: Agora tem.
        // 2. Ele tinha um antigo: Atualizamos para o da compra (mais confiável para contato imediato).
        await pool.query(
            'UPDATE users SET phone = $1 WHERE id = $2',
            [cleanPhone, user.id]
        );
      }
      // -------------------------------------------------------

      // 3. ATIVAR A ASSINATURA (PREMIUM)
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // 4. ENVIAR E-MAIL DE CONFIRMAÇÃO
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'O pagamento foi confirmado e seu acesso Premium ao Foca.aí está liberado. Nosso agente inteligente entrará em contato pelo WhatsApp em instantes.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });
    }

    // LÓGICA DE CANCELAMENTO
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED'].includes(status)) {
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}