import pool from '../lib/db.js';
import { signToken, verifyToken } from '../lib/auth.js';
import { logError, logInfo, logSecurityEvent } from '../lib/logger.js';

const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

// Normaliza telefone para padrão apenas números com DDI 55
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  // Remove DDI 55 se já vier com ele (ex: +5511999999999 → 11999999999)
  if (clean.startsWith('55') && clean.length >= 12) {
    clean = clean.slice(2);
  }
  // Agora adiciona o 55 padronizado
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  return clean;
}

// Verifica se o token é de admin, retorna tokenData ou envia erro
function verifyAdmin(req, res) {
  let tokenData;
  try {
    tokenData = verifyToken(req);
  } catch {
    res.status(401).json({ message: 'Token inválido ou não fornecido.' });
    return null;
  }
  if (tokenData.role !== 'admin') {
    logSecurityEvent('Admin - Unauthorized Role', {
      role: tokenData.role,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });
    res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
    return null;
  }
  return tokenData;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { action } = req.body || req.query || {};

  // ===== AÇÃO: LOGIN =====
  if (req.method === 'POST' && action === 'login') {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ADMIN_PASS) {
      logError('ADMIN_PASS não configurado nas variáveis de ambiente', null, { critical: true });
      return res.status(500).json({ message: 'Erro de configuração do servidor.' });
    }

    if (username !== ADMIN_USER || password !== ADMIN_PASS) {
      logSecurityEvent('Admin Login Failed', {
        username,
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
      });
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    try {
      const token = signToken({ role: 'admin', username });

      logSecurityEvent('Admin Login Success', {
        username,
        ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
      });

      return res.status(200).json({ token });
    } catch (error) {
      logError('Admin Login Error', error);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }

  // ===== AÇÃO: REGISTRO MANUAL =====
  if (req.method === 'POST' && action === 'register') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { name, phone } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios.' });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Telefone inválido.' });
    }

    try {
      // Verifica se já existe usuário com esse telefone
      const existingUser = await pool.query(
        'SELECT id, name, phone FROM users WHERE phone = $1 LIMIT 1',
        [normalizedPhone]
      );

      if (existingUser.rows.length > 0) {
        const user = existingUser.rows[0];
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await pool.query(
          `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
           VALUES ($1, 'active', 'premium', $2, false)
           ON CONFLICT (user_id)
           DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
          [user.id, endDate]
        );

        // Atualiza subscription_expires_at na tabela users
        await pool.query(
          'UPDATE users SET subscription_expires_at = $1 WHERE id = $2',
          [endDate, user.id]
        );

        // Envia para n8n (WhatsApp)
        try {
          await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: user.name,
              phone: normalizedPhone,
              status: 'approved',
              is_trial: false,
              origin: 'admin_panel'
            })
          });
        } catch (n8nError) {
          logError('N8N webhook failed (admin reactivation)', n8nError);
        }

        logInfo('Admin - User Reactivated', {
          userId: user.id, name: user.name, phone: normalizedPhone,
          endDate: endDate.toISOString(), admin: tokenData.username
        });

        return res.status(200).json({
          message: `"${user.name}" já existia. Matrícula reativada por 30 dias!`,
          user: { id: user.id, name: user.name, phone: user.phone },
          subscription: { status: 'active', current_period_end: endDate.toISOString() },
          reactivated: true
        });
      }

      // Criar novo usuário
      const newUser = await pool.query(
        `INSERT INTO users (name, phone, is_verified, created_at)
         VALUES ($1, $2, TRUE, NOW())
         RETURNING id, name, phone, created_at`,
        [name.trim(), normalizedPhone]
      );

      const user = newUser.rows[0];
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
         VALUES ($1, 'active', 'premium', $2, false)
         ON CONFLICT (user_id)
         DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
        [user.id, endDate]
      );

      // Atualiza subscription_expires_at na tabela users
      await pool.query(
        'UPDATE users SET subscription_expires_at = $1 WHERE id = $2',
        [endDate, user.id]
      );

      // Envia para n8n (WhatsApp)
      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: normalizedPhone,
            status: 'approved',
            is_trial: false,
            origin: 'admin_panel'
          })
        });
      } catch (n8nError) {
        logError('N8N webhook failed (admin registration)', n8nError);
      }

      logInfo('Admin - User Registered', {
        userId: user.id, name, phone: normalizedPhone,
        endDate: endDate.toISOString(), admin: tokenData.username
      });

      return res.status(201).json({
        message: `"${name}" registrado com sucesso! Matrícula ativa por 30 dias.`,
        user: { id: user.id, name: user.name, phone: user.phone, created_at: user.created_at },
        subscription: { status: 'active', current_period_end: endDate.toISOString() },
        reactivated: false
      });

    } catch (error) {
      logError('Admin Register Error', error);
      return res.status(500).json({ message: 'Erro interno ao registrar.' });
    }
  }

  // ===== AÇÃO: LISTAR REGISTROS RECENTES =====
  if (req.method === 'POST' && action === 'list-registrations') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    try {
      const result = await pool.query(
        `SELECT u.id, u.name, u.phone, u.created_at,
                s.status AS sub_status, s.current_period_end
         FROM users u
         LEFT JOIN subscriptions s ON s.user_id = u.id
         ORDER BY u.created_at DESC
         LIMIT 50`
      );

      return res.status(200).json({ registrations: result.rows });
    } catch (error) {
      logError('Admin List Registrations Error', error);
      return res.status(500).json({ message: 'Erro ao listar registros.' });
    }
  }

  return res.status(400).json({ message: 'Ação inválida. Use action: "login", "register" ou "list-registrations".' });
}
