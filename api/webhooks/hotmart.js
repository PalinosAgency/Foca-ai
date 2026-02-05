import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';

// Configurações
const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN;
// URL do seu n8n (Versão de Produção - Corrigida)
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');

  // Apenas aceita POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const data = req.body;
  console.log('[WEBHOOK HOTMART] Recebido:', JSON.stringify(data));

  // 1. Verificação de Segurança (Token da Hotmart)
  if (HOTMART_TOKEN && data.hottok && data.hottok !== HOTMART_TOKEN) {
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  const email = data.email;
  const status = data.status ? data.status.toUpperCase() : ''; 

  if (!email) return res.status(200).send('Ignored: No Email');

  try {
    // 2. Achar o usuário pelo e-mail
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`[WEBHOOK] Usuário não encontrado para o email: ${email}`);
      // Retornamos 200 para a Hotmart não ficar tentando reenviar, já que o erro é nosso (usuário não existe)
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 3. LÓGICA DE APROVAÇÃO (Compra Confirmada)
    if (status === 'APPROVED' || status === 'COMPLETED') {
      
      // --- LÓGICA DO TELEFONE ---
      let phoneToUpdate = null;
      // 'finalPhone' é o número que enviaremos para o n8n. Começa com o que já temos no banco.
      let finalPhone = user.phone; 

      // Verifica se a Hotmart mandou telefone novo
      if (data.phone_checkout_number) {
        phoneToUpdate = data.phone_checkout_number;
      } else if (data.phone_number) {
        const ddd = data.phone_local_code || '';
        const number = data.phone_number;
        phoneToUpdate = `55${ddd}${number}`; 
      }

      // Se tiver telefone novo, limpamos e salvamos
      if (phoneToUpdate) {
        let cleanPhone = phoneToUpdate.replace(/\D/g, ''); // Remove tudo que não for número
        
        // Adiciona o + se não tiver
        if (!cleanPhone.startsWith('+')) {
            cleanPhone = `+${cleanPhone}`;
        }

        console.log(`[WEBHOOK] Atualizando telefone. De: ${user.phone} Para: ${cleanPhone}`);
        
        // Atualiza no Banco
        await pool.query(
            'UPDATE users SET phone = $1 WHERE id = $2',
            [cleanPhone, user.id]
        );
        
        // Atualiza a variável que vai pro n8n
        finalPhone = cleanPhone; 
      }
      // ----------------------------

      // 4. ATIVAR A ASSINATURA (PREMIUM)
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // 5. ENVIAR E-MAIL DE BOAS-VINDAS
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'O pagamento foi confirmado e seu acesso Premium ao Foca.aí está liberado. Nosso agente inteligente entrará em contato pelo WhatsApp em instantes.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });

      // 6. AVISAR O AGENTE (N8N) - URL DE PRODUÇÃO
      try {
        console.log('[WEBHOOK] Enviando dados para o n8n (Produção)...');
        
        // Envia os dados para o seu fluxo do n8n
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: email,
                phone: finalPhone, // Envia o número mais atualizado (formatado com +55...)
                status: 'active',
                origin: 'hotmart_webhook'
            })
        });
        
        console.log('[WEBHOOK] n8n avisado com sucesso!');
      } catch (n8nError) {
        // Se o n8n cair, não podemos travar o processo da Hotmart, apenas logamos o erro.
        console.error('[WEBHOOK ERROR] Falha ao conectar com n8n:', n8nError);
      }
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