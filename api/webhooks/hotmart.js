import pool from '../../lib/db.js';
import { sendEmail } from '../../lib/email.js';
import { validateHotmartWebhook, validateHotmartPayload } from '../../lib/security/webhookValidator.js';
import { logError, logSecurityEvent, logInfo } from '../../lib/logger.js';

const HOTMART_TOKEN = process.env.HOTMART_WEBHOOK_TOKEN; // ✅ Usando o nome já configurado na Vercel
const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

// --- PADRÃO APENAS NÚMEROS (SEM +) ---
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  return clean;
}

export default async function handler(req, res) {


  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const body = req.body;

  // ✅ 1. VALIDAÇÃO DE ASSINATURA HMAC (Se configurada)
  if (HOTMART_TOKEN) {
    const signature = req.headers['x-hotmart-hottok'] || body.hottok || body.data?.hottok;

    if (!validateHotmartWebhook(body, signature, HOTMART_TOKEN)) {
      logSecurityEvent('Hotmart Webhook Signature Invalid', {
        ip: req.headers['x-forwarded-for'] || 'unknown',
        hasSignature: !!signature,
        event: body.event
      });
      return res.status(401).json({ message: 'Unauthorized: Invalid Signature' });
    }

    logInfo('Hotmart Webhook Signature Valid', { event: body.event });
  } else {
    logSecurityEvent('Hotmart Webhook Without HMAC Validation', {
      reason: 'HOTMART_WEBHOOK_SECRET not configured'
    });
  }

  // ✅ 2. VALIDAÇÃO DE PAYLOAD
  const payloadValidation = validateHotmartPayload(body);
  if (!payloadValidation.valid) {
    logError('Hotmart Webhook Invalid Payload', null, {
      errors: payloadValidation.errors,
      event: body.event
    });
    return res.status(400).json({
      message: 'Invalid payload',
      errors: payloadValidation.errors
    });
  }

  // 3. LOG DE SEGURANÇA
  try {
    await pool.query(
      'INSERT INTO webhook_logs (event_type, payload) VALUES ($1, $2)',
      [body.event || 'UNKNOWN', JSON.stringify(body)]
    );
  } catch (e) {
    logError('Failed to save webhook log', e);
  }

  const data = body.data || body;

  // --- E-MAIL ---
  const rawEmail = data.buyer?.email || data.subscriber?.email || data.user?.email || data.email;
  const email = rawEmail ? rawEmail.trim().toLowerCase() : null;

  // --- TELEFONE (Só Números) ---
  let rawPhone = data.buyer?.checkout_phone || data.buyer?.phone || data.phone_checkout_number;
  if (!rawPhone && data.subscriber?.phone) {
    rawPhone = (data.subscriber.phone.ddd || '') + (data.subscriber.phone.number || '');
  }
  const phone = normalizePhone(rawPhone);

  // --- STATUS ---
  let statusRaw = data.subscription?.status || data.purchase?.status || data.status || '';
  if (body.event === 'SUBSCRIPTION_CANCELLATION') statusRaw = 'CANCELED';
  const status = statusRaw.toUpperCase();

  if (!email) {
    logInfo('Webhook ignored - No email', { event: body.event });
    return res.status(200).send('Ignored: No Email');
  }

  try {
    // 4. BUSCA DO USUÁRIO
    let userRes;
    if (phone) {
      userRes = await pool.query(
        'SELECT id, name, phone, email FROM users WHERE email = $1 OR phone = $2 LIMIT 1',
        [email, phone]
      );
    } else {
      userRes = await pool.query(
        'SELECT id, name, phone, email FROM users WHERE email = $1 LIMIT 1',
        [email]
      );
    }

    if (userRes.rows.length === 0) {
      logInfo('Webhook - User not found', { email, event: body.event });
      return res.status(200).send('User not found');
    }

    const user = userRes.rows[0];
    const isApproved = ['APPROVED', 'COMPLETED', 'ACTIVE'].includes(status);

    // --- APROVAÇÃO ---
    if (isApproved) {
      logInfo('Webhook - Payment Approved', {
        userId: user.id,
        email,
        status,
        event: body.event
      });

      // Atualiza telefone (se necessário)
      if (phone && user.phone !== phone) {
        await pool.query('UPDATE users SET phone = $1 WHERE id = $2', [phone, user.id]);
      }

      // --- LÓGICA DE TRIAL VS PAGAMENTO REAL ---
      const pricePaid = data.purchase?.price?.value || data.price?.value || 0;
      const daysToAdd = pricePaid > 0.5 ? 35 : 4;

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + daysToAdd);

      logInfo('Webhook - Subscription Created', {
        userId: user.id,
        pricePaid,
        daysToAdd,
        endDate: endDate.toISOString()
      });

      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end)
         VALUES ($1, 'active', 'premium', $2)
         ON CONFLICT (user_id) 
         DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium'`,
        [user.id, endDate]
      );

      // Envia E-mail de Boas-vindas
      await sendEmail({
        to: email,
        subject: daysToAdd > 10 ? 'Matrícula Confirmada! 🚀' : 'Período de Teste Iniciado! 🧪',
        title: `Bem-vindo(a), ${user.name || 'Estudante'}!`,
        message: daysToAdd > 10
          ? 'Seu pagamento foi confirmado e sua conta premium está ativa.'
          : 'Aproveite seus 3 dias de teste grátis com acesso total!',
        buttonText: 'ACESSAR PLATAFORMA',
        buttonLink: 'https://foca-ai-oficial.vercel.app/'
      });

      // Envia para o n8n
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            phone: phone || user.phone,
            status: 'approved',
            is_trial: daysToAdd < 10,
            hotmart_original_status: status,
            origin: 'hotmart_webhook_v2_site'
          })
        });
      } catch (n8nError) {
        logError('N8N webhook failed', n8nError);
      }
    }

    // --- CANCELAMENTO / REEMBOLSO ---
    else if (['CANCELED', 'REFUNDED', 'CHARGEBACK', 'EXPIRED', 'INACTIVE'].includes(status)) {
      logInfo('Webhook - Subscription Canceled', {
        userId: user.id,
        status,
        event: body.event
      });

      let query = `UPDATE subscriptions SET status = 'canceled' WHERE user_id = $1`;

      if (['REFUNDED', 'CHARGEBACK'].includes(status)) {
        query = `UPDATE subscriptions SET status = 'canceled', current_period_end = NOW() - INTERVAL '1 day' WHERE user_id = $1`;
      }

      await pool.query(query, [user.id]);

      if (!['REFUNDED', 'CHARGEBACK'].includes(status)) {
        await sendEmail({
          to: email,
          subject: 'Sua assinatura foi cancelada',
          title: 'Cancelamento Confirmado',
          message: `Sua assinatura foi cancelada. Seu acesso continua válido até o fim do período atual.`,
          buttonText: 'Minha Conta',
          buttonLink: 'https://foca-ai-oficial.vercel.app/account'
        });
      }
    }

    return res.status(200).send('OK');

  } catch (error) {
    logError('Hotmart Webhook Processing Error', error, {
      email,
      status,
      event: body.event
    });
    return res.status(500).send('Internal Server Error');
  }
}