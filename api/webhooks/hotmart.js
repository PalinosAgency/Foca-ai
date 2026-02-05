import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

// Configurações
const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
// URL do seu n8n (Produção)
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;
  console.log('[WEBHOOK HOTMART] Recebido:', JSON.stringify(data));

  // 1. Verificação de Segurança
  if (HOTMART_TOKEN && data.hottok && data.hottok !== HOTMART_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  const email = data.email;
  const status = data.status ? data.status.toUpperCase() : ''; 

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 2. Achar usuário
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`[WEBHOOK] Usuário não encontrado: ${email}`);
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 3. LÓGICA DE APROVAÇÃO
    if (status === 'APPROVED' || status === 'COMPLETED') {
      
      // --- Atualização de Telefone ---
      let phoneToUpdate = null;
      let finalPhone = user.phone; 

      if (data.phone_checkout_number) {
        phoneToUpdate = data.phone_checkout_number;
      } else if (data.phone_number) {
        const ddd = data.phone_local_code || '';
        const number = data.phone_number;
        phoneToUpdate = `55${ddd}${number}`; 
      }

      if (phoneToUpdate) {
        let cleanPhone = phoneToUpdate.replace(/\D/g, '');
        if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

        console.log(`[WEBHOOK] Atualizando telefone: ${cleanPhone}`);
        await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [cleanPhone, user.id]);
        finalPhone = cleanPhone; 
      }

      // 4. Ativar Assinatura
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // 5. Enviar E-mail de Boas-vindas
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'Pagamento confirmado! Nosso agente entrará em contato.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });

      // 6. AVISAR O N8N
      try {
        console.log('[WEBHOOK] Enviando status APPROVED para o n8n...');
        
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: email,
                phone: finalPhone,
                status: 'approved', 
                hotmart_status: status, 
                origin: 'hotmart_webhook'
            })
        });
        
        console.log('[WEBHOOK] Dados enviados para o n8n!');
      } catch (n8nError) {
        console.error('[WEBHOOK ERROR] n8n falhou:', n8nError);
      }
    }

    // 4. LÓGICA DE CANCELAMENTO (ATUALIZADA)
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED'].includes(status)) {
      
      // Atualiza no banco
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );

      // NOVO: Envia E-mail de Cancelamento
      console.log(`[WEBHOOK] Enviando email de cancelamento para ${email}`);
      await sendEmail({
        to: email,
        subject: 'Sua assinatura foi cancelada 😢',
        title: 'Sentiremos sua falta!',
        message: 'Confirmamos o cancelamento da sua assinatura Premium. Seu acesso aos recursos exclusivos foi encerrado. Se mudar de ideia, estaremos te esperando!',
        buttonText: 'REATIVAR ASSINATURA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/'
      });
    }

    return res.status(200).send('OK');

  } catch (error) {
    console.error('[WEBHOOK ERROR]', error);
    return res.status(500).send('Internal Server Error');
  }
}