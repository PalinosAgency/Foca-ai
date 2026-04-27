import pool from '../lib/db.js';
import { signToken, verifyToken } from '../lib/auth.js';
import { logError, logInfo, logSecurityEvent } from '../lib/logger.js';

const N8N_WEBHOOK_URL = 'https://n8n.projetospalinos.online/webhook/hotmart-venda-aprovada';

// Normaliza telefone para padrão apenas números com DDI 55
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.startsWith('55') && clean.length >= 12) {
    clean = clean.slice(2);
  }
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  return clean;
}

// Calcula data final baseada na duração a partir de agora
function calcEndDate(duration) {
  if (duration === 'lifetime') {
    return new Date('2099-12-31T23:59:59Z');
  }
  const months = parseInt(duration, 10) || 1;
  const end = new Date();
  end.setMonth(end.getMonth() + months);
  return end;
}

// Calcula data final baseada na duração a partir de uma data base
function calcEndDateFrom(baseDate, duration) {
  if (duration === 'lifetime') {
    return new Date('2099-12-31T23:59:59Z');
  }
  const months = parseInt(duration, 10) || 1;
  const end = new Date(baseDate);
  end.setMonth(end.getMonth() + months);
  return end;
}

// Verifica se o token é de admin
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

  // ===== AÇÃO: LOGIN (Google Auth com Whitelist) =====
  if (req.method === 'POST' && action === 'login-google') {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: 'Token do Google é obrigatório.' });
    }

    try {
      // 1. Valida o token do Google e pega o e-mail
      const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      
      if (!googleRes.ok) {
        return res.status(401).json({ message: 'Token do Google inválido ou expirado.' });
      }

      const googleData = await googleRes.json();
      const email = googleData.email;

      if (!email) {
        return res.status(400).json({ message: 'Não foi possível obter o e-mail do Google.' });
      }

      // 2. Verifica a Whitelist usando Variáveis de Ambiente e Banco de Dados
      const allowedEmails = [process.env.ADMIN_1_EMAIL, process.env.ADMIN_2_EMAIL].filter(Boolean);
      let isAllowed = allowedEmails.includes(email);

      if (!isAllowed) {
        const dbRes = await pool.query('SELECT email FROM admin_emails WHERE email = $1', [email]);
        if (dbRes.rows.length > 0) {
          isAllowed = true;
        }
      }

      if (!isAllowed) {
        logSecurityEvent('Admin Login Blocked - Not in Whitelist', { email, ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress });
        return res.status(403).json({ message: 'Acesso negado. E-mail não autorizado.' });
      }

      // 3. Sucesso! Gera o JWT Final
      const token = signToken({ role: 'admin', username: email });
      logSecurityEvent('Admin Login Success Google SSO', { email, ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress });
      
      return res.status(200).json({ token });

    } catch (error) {
      logError('Admin Login Google Error', error);
      return res.status(500).json({ message: 'Erro interno ao processar login.' });
    }
  }

  // ===== AÇÃO: REGISTRO MANUAL (com duração flexível) =====
  if (req.method === 'POST' && action === 'register') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { name, phone, duration = 1 } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Nome e telefone são obrigatórios.' });
    }

    const normalizedPhone = normalizePhone(phone);
    if (!normalizedPhone) {
      return res.status(400).json({ message: 'Telefone inválido.' });
    }

    const endDate = calcEndDate(duration);
    const isLifetime = duration === 'lifetime';
    const durationLabel = isLifetime ? 'vitalício' : `${duration} mês(es)`;

    try {
      // Verifica se já existe usuário com esse telefone
      const existingUser = await pool.query(
        'SELECT id, name, phone FROM users WHERE phone = $1 LIMIT 1',
        [normalizedPhone]
      );

      let user;
      let reactivated = false;

      if (existingUser.rows.length > 0) {
        user = existingUser.rows[0];
        reactivated = true;
      } else {
        const newUser = await pool.query(
          `INSERT INTO users (name, phone, is_verified, created_at)
           VALUES ($1, $2, TRUE, NOW())
           RETURNING id, name, phone, created_at`,
          [name.trim(), normalizedPhone]
        );
        user = newUser.rows[0];
      }

      // Upsert assinatura
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
            name: user.name || name.trim(),
            phone: normalizedPhone,
            status: 'approved',
            is_trial: false,
            origin: 'admin_panel'
          })
        });
      } catch (n8nError) {
        logError('N8N webhook failed (admin)', n8nError);
      }

      logInfo(`Admin - User ${reactivated ? 'Reactivated' : 'Registered'}`, {
        userId: user.id, name: user.name, phone: normalizedPhone,
        duration: durationLabel, endDate: endDate.toISOString(), admin: tokenData.username
      });

      const msg = reactivated
        ? `"${user.name}" já existia. Matrícula reativada — ${durationLabel}!`
        : `"${name}" registrado com sucesso! Matrícula ativa — ${durationLabel}.`;

      return res.status(reactivated ? 200 : 201).json({
        message: msg,
        user: { id: user.id, name: user.name, phone: user.phone },
        subscription: { status: 'active', current_period_end: endDate.toISOString() },
        reactivated
      });

    } catch (error) {
      logError('Admin Register Error', error);
      return res.status(500).json({ message: 'Erro interno ao registrar.' });
    }
  }

  // ===== AÇÃO: LISTAR USUÁRIOS (com paginação, filtros e busca) =====
  if (req.method === 'POST' && action === 'list-users') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { page = 1, limit = 20, filter = 'all', search = '' } = req.body;
    const offset = (page - 1) * limit;

    try {
      let whereConditions = [];
      let params = [];
      let paramIndex = 1;

      // Busca por nome ou telefone
      if (search.trim()) {
        whereConditions.push(`(u.name ILIKE $${paramIndex} OR u.phone ILIKE $${paramIndex + 1})`);
        params.push(`%${search.trim()}%`, `%${search.trim()}%`);
        paramIndex += 2;
      }

      // Filtro de status
      if (filter === 'active') {
        whereConditions.push(`s.status = 'active' AND s.current_period_end > NOW()`);
      } else if (filter === 'canceled') {
        whereConditions.push(`s.status = 'canceled'`);
      } else if (filter === 'expired') {
        whereConditions.push(`s.status = 'active' AND s.current_period_end <= NOW()`);
      } else if (filter === 'no-plan') {
        whereConditions.push(`s.id IS NULL`);
      }

      const whereClause = whereConditions.length > 0
        ? 'WHERE ' + whereConditions.join(' AND ')
        : '';

      // Total count
      const countResult = await pool.query(
        `SELECT COUNT(*) FROM users u LEFT JOIN subscriptions s ON s.user_id = u.id ${whereClause}`,
        params
      );
      const total = parseInt(countResult.rows[0].count, 10);

      // Dados paginados
      const dataResult = await pool.query(
        `SELECT u.id, u.name, u.phone, u.email, u.created_at,
                s.status AS sub_status, s.plan_id, s.current_period_end, s.auto_renew
         FROM users u
         LEFT JOIN subscriptions s ON s.user_id = u.id
         ${whereClause}
         ORDER BY u.created_at DESC
         LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      );

      return res.status(200).json({
        users: dataResult.rows,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      });

    } catch (error) {
      logError('Admin List Users Error', error);
      return res.status(500).json({ message: 'Erro ao listar usuários.' });
    }
  }

  // ===== AÇÃO: ATUALIZAR ASSINATURA (cancelar ou reativar) =====
  if (req.method === 'POST' && action === 'update-subscription') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { userId, operation, duration } = req.body;

    if (!userId || !['cancel', 'reactivate', 'extend'].includes(operation)) {
      return res.status(400).json({ message: 'userId e operation (cancel/reactivate/extend) são obrigatórios.' });
    }

    try {
      // Verifica se o usuário existe
      const userRes = await pool.query('SELECT id, name FROM users WHERE id = $1', [userId]);
      if (userRes.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      const user = userRes.rows[0];

      if (operation === 'cancel') {
        await pool.query(
          `UPDATE subscriptions SET status = 'canceled', auto_renew = false WHERE user_id = $1`,
          [userId]
        );

        await pool.query(
          'UPDATE users SET subscription_expires_at = NULL WHERE id = $1',
          [userId]
        );

        logInfo('Admin - Subscription Canceled', {
          userId, name: user.name, admin: tokenData.username
        });

        return res.status(200).json({ message: `Assinatura de "${user.name}" cancelada.` });
      }

      if (operation === 'reactivate') {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 30);

        await pool.query(
          `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
           VALUES ($1, 'active', 'premium', $2, false)
           ON CONFLICT (user_id)
           DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
          [userId, endDate]
        );

        await pool.query(
          'UPDATE users SET subscription_expires_at = $1 WHERE id = $2',
          [endDate, userId]
        );

        logInfo('Admin - Subscription Reactivated', {
          userId, name: user.name, endDate: endDate.toISOString(), admin: tokenData.username
        });

        return res.status(200).json({
          message: `Assinatura de "${user.name}" reativada por 30 dias.`,
          subscription: { status: 'active', current_period_end: endDate.toISOString() }
        });
      }

      if (operation === 'extend') {
        if (!duration) {
          return res.status(400).json({ message: 'Duração é obrigatória para estender a assinatura.' });
        }

        const subRes = await pool.query('SELECT current_period_end, status FROM subscriptions WHERE user_id = $1', [userId]);
        let baseDate = new Date();

        if (subRes.rows.length > 0) {
          const sub = subRes.rows[0];
          const currentEnd = new Date(sub.current_period_end);
          if (sub.status === 'active' && currentEnd > new Date()) {
            baseDate = currentEnd;
          }
        }

        const endDate = calcEndDateFrom(baseDate, duration);

        await pool.query(
          `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
           VALUES ($1, 'active', 'premium', $2, false)
           ON CONFLICT (user_id)
           DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
          [userId, endDate]
        );

        await pool.query(
          'UPDATE users SET subscription_expires_at = $1 WHERE id = $2',
          [endDate, userId]
        );

        const durationLabel = duration === 'lifetime' ? 'vitalício' : `${duration} mês(es)`;

        logInfo('Admin - Subscription Extended', {
          userId, name: user.name, duration: durationLabel, endDate: endDate.toISOString(), admin: tokenData.username
        });

        return res.status(200).json({
          message: `Tempo adicionado com sucesso para "${user.name}" (${durationLabel}).`,
          subscription: { status: 'active', current_period_end: endDate.toISOString() }
        });
      }

    } catch (error) {
      logError('Admin Update Subscription Error', error);
      return res.status(500).json({ message: 'Erro ao atualizar assinatura.' });
    }
  }

  // ===== AÇÃO: ESTATÍSTICAS =====
  if (req.method === 'POST' && action === 'get-stats') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    try {
      const result = await pool.query(`
        SELECT
          COUNT(DISTINCT u.id) AS total,
          COUNT(DISTINCT CASE WHEN s.status = 'active' AND s.current_period_end > NOW() THEN u.id END) AS active,
          COUNT(DISTINCT CASE WHEN s.status = 'canceled' THEN u.id END) AS canceled,
          COUNT(DISTINCT CASE WHEN s.status = 'active' AND s.current_period_end <= NOW() THEN u.id END) AS expired,
          COUNT(DISTINCT CASE WHEN s.id IS NULL THEN u.id END) AS no_plan
        FROM users u
        LEFT JOIN subscriptions s ON s.user_id = u.id
      `);

      const stats = result.rows[0];
      return res.status(200).json({
        total: parseInt(stats.total, 10),
        active: parseInt(stats.active, 10),
        canceled: parseInt(stats.canceled, 10),
        expired: parseInt(stats.expired, 10),
        noPlan: parseInt(stats.no_plan, 10)
      });

    } catch (error) {
      logError('Admin Get Stats Error', error);
      return res.status(500).json({ message: 'Erro ao buscar estatísticas.' });
    }
  }

  // ===== COMPATIBILIDADE: list-registrations (redireciona para list-users) =====
  if (req.method === 'POST' && action === 'list-registrations') {
    req.body = { ...req.body, action: 'list-users', page: 1, limit: 50 };
    return handler(req, res);
  }

  // ===== AÇÃO: GERENCIAR ADMINS =====
  if (req.method === 'POST' && action === 'list-admins') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    try {
      const result = await pool.query('SELECT email, created_at, created_by FROM admin_emails ORDER BY created_at DESC');
      
      const envAdmins = [process.env.ADMIN_1_EMAIL, process.env.ADMIN_2_EMAIL].filter(Boolean).map(email => ({
        email,
        created_at: new Date().toISOString(),
        created_by: 'Sistema',
        isEnv: true
      }));

      return res.status(200).json({ admins: [...envAdmins, ...result.rows] });
    } catch (error) {
      logError('Admin List Error', error);
      return res.status(500).json({ message: 'Erro ao listar administradores.' });
    }
  }

  if (req.method === 'POST' && action === 'add-admin') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }

    try {
      await pool.query(
        'INSERT INTO admin_emails (email, created_by) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING',
        [email.trim().toLowerCase(), tokenData.username]
      );
      return res.status(201).json({ message: `Administrador ${email} adicionado com sucesso.` });
    } catch (error) {
      logError('Admin Add Error', error);
      return res.status(500).json({ message: 'Erro ao adicionar administrador.' });
    }
  }

  if (req.method === 'POST' && action === 'remove-admin') {
    const tokenData = verifyAdmin(req, res);
    if (!tokenData) return;

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }

    try {
      const result = await pool.query('DELETE FROM admin_emails WHERE email = $1 RETURNING email', [email.trim().toLowerCase()]);
      if (result.rowCount === 0) {
         return res.status(404).json({ message: 'Administrador não encontrado no banco (Variáveis de ambiente não podem ser excluídas).' });
      }
      return res.status(200).json({ message: `Administrador ${email} removido com sucesso.` });
    } catch (error) {
      logError('Admin Remove Error', error);
      return res.status(500).json({ message: 'Erro ao remover administrador.' });
    }
  }

  return res.status(400).json({
    message: 'Ação inválida. Use: login, register, list-users, update-subscription, get-stats, list-admins, add-admin, remove-admin.'
  });
}
