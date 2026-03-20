import pool from '../../lib/db.js';
import { verifyToken } from '../../lib/auth.js';
import { logError, logInfo, logSecurityEvent } from '../../lib/logger.js';

// Normaliza telefone para padrão apenas números com DDI 55
function normalizePhone(phone) {
  if (!phone) return null;
  let clean = phone.replace(/\D/g, '');
  if (clean.length >= 10 && clean.length <= 11) {
    clean = '55' + clean;
  }
  return clean;
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  // 1. Verifica autenticação admin
  let tokenData;
  try {
    tokenData = verifyToken(req);
  } catch {
    return res.status(401).json({ message: 'Token inválido ou não fornecido.' });
  }

  if (tokenData.role !== 'admin') {
    logSecurityEvent('Admin Register - Unauthorized Role', {
      role: tokenData.role,
      ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    });
    return res.status(403).json({ message: 'Acesso negado. Apenas administradores.' });
  }

  // 2. Validar dados
  const { name, phone } = req.body || {};

  if (!name || !phone) {
    return res.status(400).json({ message: 'Nome e telefone são obrigatórios.' });
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return res.status(400).json({ message: 'Telefone inválido.' });
  }

  try {
    // 3. Verifica se já existe usuário com esse telefone
    const existingUser = await pool.query(
      'SELECT id, name, phone FROM users WHERE phone = $1 LIMIT 1',
      [normalizedPhone]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];

      // Usuário já existe - ativa/atualiza assinatura
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      await pool.query(
        `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
         VALUES ($1, 'active', 'premium', $2, false)
         ON CONFLICT (user_id)
         DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
        [user.id, endDate]
      );

      logInfo('Admin - Investor Reactivated', {
        userId: user.id,
        name: user.name,
        phone: normalizedPhone,
        endDate: endDate.toISOString(),
        admin: tokenData.username
      });

      return res.status(200).json({
        message: `Investidor "${user.name}" já existia. Matrícula reativada por 30 dias!`,
        user: { id: user.id, name: user.name, phone: user.phone },
        subscription: { status: 'active', current_period_end: endDate.toISOString() }
      });
    }

    // 4. Criar novo usuário (sem e-mail, sem senha, verificado)
    const newUser = await pool.query(
      `INSERT INTO users (name, phone, is_verified, created_at)
       VALUES ($1, $2, TRUE, NOW())
       RETURNING id, name, phone`,
      [name.trim(), normalizedPhone]
    );

    const user = newUser.rows[0];

    // 5. Criar assinatura ativa por 30 dias
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 30);

    await pool.query(
      `INSERT INTO subscriptions (user_id, status, plan_id, current_period_end, auto_renew)
       VALUES ($1, 'active', 'premium', $2, false)
       ON CONFLICT (user_id)
       DO UPDATE SET status = 'active', current_period_end = $2, plan_id = 'premium', auto_renew = false`,
      [user.id, endDate]
    );

    logInfo('Admin - Investor Registered', {
      userId: user.id,
      name,
      phone: normalizedPhone,
      endDate: endDate.toISOString(),
      admin: tokenData.username
    });

    return res.status(201).json({
      message: `Investidor "${name}" registrado com sucesso! Matrícula ativa por 30 dias.`,
      user: { id: user.id, name: user.name, phone: user.phone },
      subscription: { status: 'active', current_period_end: endDate.toISOString() }
    });

  } catch (error) {
    logError('Admin Register Investor Error', error);
    return res.status(500).json({ message: 'Erro interno ao registrar investidor.' });
  }
}
