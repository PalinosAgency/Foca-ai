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

  // --- TRATAMENTO INTELIGENTE DA ESTRUTURA (1.0 vs 2.0) ---
  const body = req.body;
  console.log('[WEBHOOK HOTMART] Payload Recebido:', JSON.stringify(body).substring(0, 500) + '...'); // Log resumido

  // 1. Extração de Dados (Compatível com Hotmart 2.0)
  // Na v2.0, tudo fica dentro de 'data'.
  const data = body.data || body; 
  
  // Extrai E-mail
  const email = data.buyer?.email || data.email;
  
  // Extrai Status (Pode estar em vários lugares)
  let statusRaw = 
    data.subscription?.status || // Assinatura (ACTIVE)
    data.purchase?.status ||     // Compra (APPROVED)
    data.status ||               // Legado
    '';
  
  const status = statusRaw.toUpperCase();

  // 2. Validação do Token (Header ou Body)
  const receivedToken = req.headers['x-hotmart-hottok'] || body.hottok || data.hottok;
  
  if (HOTMART_TOKEN && receivedToken && receivedToken !== HOTMART_TOKEN) {
    console.error('[WEBHOOK] Token Inválido:', receivedToken);
    return res.status(401).json({ message: 'Unauthorized: Invalid Token' });
  }

  if (!email) {
    console.log('[WEBHOOK] Ignorado: Sem e-mail no payload.');
    return res.status(200).send('Ignored: No Email');
  }

  try {
    // 3. Achar usuário
    const userRes = await pool.query('SELECT id, name, phone FROM users WHERE email = $1', [email]);
    
    if (userRes.rows.length === 0) {
      console.log(`[WEBHOOK] Usuário não encontrado: ${email}`);
      return res.status(200).send('User not found'); 
    }

    const user = userRes.rows[0];

    // 4. LÓGICA DE APROVAÇÃO
    // Hotmart envia 'APPROVED', 'COMPLETED' ou 'ACTIVE' (para assinaturas)
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    if (isApproved) {
      
      // --- Atualização de Telefone (Lógica v2.0) ---
      let phoneToUpdate = null;
      let finalPhone = user.phone; 

      // Tenta pegar o telefone de todas as formas possíveis da Hotmart
      if (data.buyer?.checkout_phone) {
        phoneToUpdate = data.buyer.checkout_phone;
      } else if (data.buyer?.phone) {
        phoneToUpdate = data.buyer.phone;
      } else if (data.phone_checkout_number) {
        phoneToUpdate = data.phone_checkout_number;
      }

      if (phoneToUpdate) {
        let cleanPhone = phoneToUpdate.replace(/\D/g, '');
        // Se vier sem DDI (menos de 10 dígitos é estranho, mas garantimos o 55)
        if (cleanPhone.length <= 11 && !cleanPhone.startsWith('55')) {
            cleanPhone = '55' + cleanPhone;
        }
        if (!cleanPhone.startsWith('+')) cleanPhone = `+${cleanPhone}`;

        // Só atualiza se for diferente do atual
        if (cleanPhone !== user.phone) {
            console.log(`[WEBHOOK] Atualizando telefone: ${cleanPhone}`);
            await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [cleanPhone, user.id]);
            finalPhone = cleanPhone;
        }
      }

      // 5. Ativar Assinatura
      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', NOW() + INTERVAL '35 days')
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = NOW() + INTERVAL '35 days', plan_id = 'premium'`,
        [user.id]
      );

      // 6. Enviar E-mail
      await sendEmail({
        to: email,
        subject: 'Matrícula Ativada! 🚀',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: 'Pagamento confirmado! Nosso agente entrará em contato.',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/' 
      });

      // 7. AVISAR O N8N (Com Payload Limpo)
      try {
        console.log(`[WEBHOOK] Enviando 'approved' para o n8n...`);
        
        await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: user.name,
                email: email,
                phone: finalPhone,
                status: 'approved', // Status padronizado para o n8n não se confundir
                hotmart_original_status: status,
                origin: 'hotmart_webhook_v2'
            })
        });
        
        console.log('[WEBHOOK] n8n avisado com sucesso!');
      } catch (n8nError) {
        console.error('[WEBHOOK ERROR] n8n falhou:', n8nError);
      }
    }

    // Cancelamento
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED', 'INACTIVE'].includes(status)) {
      await pool.query(
        `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`,
        [user.id]
      );
      
      await sendEmail({
        to: email,
        subject: 'Sua assinatura foi cancelada 😢',
        title: 'Sentiremos sua falta!',
        message: 'Confirmamos o cancelamento. Se mudar de ideia, estaremos aqui.',
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