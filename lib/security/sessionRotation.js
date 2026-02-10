// lib/security/sessionRotation.js
import { signToken } from '../auth.js';
import { logSecurityEvent } from '../logger.js';

/**
 * Regenera o token JWT do usuário
 * Usado após eventos sensíveis como:
 * - Troca de senha
 * - Troca de email
 * - Atualização de permissões
 * 
 * @param {object} user - Objeto do usuário
 * @param {string} reason - Razão da rotação (para auditoria)
 * @returns {string} Novo token JWT
 */
export function rotateSession(user, reason = 'session_rotation') {
    // Log de segurança para auditoria
    logSecurityEvent('Session Rotated', {
        userId: user.id,
        email: user.email,
        reason,
        timestamp: new Date().toISOString()
    });

    // Gera novo token
    const newToken = signToken({
        userId: user.id,
        email: user.email,
        // Adiciona timestamp de rotação para invalidar tokens antigos se necessário
        rotatedAt: Date.now()
    });

    return newToken;
}

/**
 * Valida se um token deve ser considerado válido
 * Pode ser usado para invalidar tokens antigos após eventos sensíveis
 * 
 * @param {object} tokenPayload - Payload decodificado do JWT
 * @param {object} user - Usuário do banco de dados
 * @returns {object} { valid: boolean, reason?: string }
 */
export function validateSessionAge(tokenPayload, user) {
    // Se o usuário tem um campo 'password_changed_at' ou similar,
    // podemos invalidar tokens emitidos antes dessa data
    if (user.password_changed_at) {
        const passwordChangedTimestamp = new Date(user.password_changed_at).getTime();
        const tokenIssuedAt = (tokenPayload.iat || 0) * 1000; // JWT usa segundos

        if (tokenIssuedAt < passwordChangedTimestamp) {
            return {
                valid: false,
                reason: 'Token emitido antes da última troca de senha'
            };
        }
    }

    return { valid: true };
}

/**
 * Middleware para forçar rotação de sessão se necessário
 * 
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next function
 */
export function enforceSessionRotation(req, res, next) {
    // Se há um usuário autenticado
    if (req.user && req.userFromDb) {
        const validation = validateSessionAge(req.user, req.userFromDb);

        if (!validation.valid) {
            logSecurityEvent('Session Invalidated', {
                userId: req.user.userId,
                reason: validation.reason
            });

            return res.status(401).json({
                message: 'Sua sessão expirou. Faça login novamente.',
                reason: 'session_expired'
            });
        }
    }

    if (next) next();
}
