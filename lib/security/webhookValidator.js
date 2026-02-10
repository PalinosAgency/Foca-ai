// lib/security/webhookValidator.js
import crypto from 'crypto';
import { logSecurityEvent, logError } from '../logger.js';

/**
 * Valida assinatura HMAC de webhook Hotmart
 * 
 * Hotmart envia a assinatura no header 'X-Hotmart-Hottok'
 * Documentação: https://developers.hotmart.com/docs/pt-BR/v1/webhooks/
 * 
 * @param {object} payload - Corpo da requisição (objeto JSON)
 * @param {string} signature - Assinatura recebida no header
 * @param {string} secret - Secret configurado no Hotmart
 * @returns {boolean} True se assinatura é válida
 */
export function validateHotmartWebhook(payload, signature, secret) {
    if (!secret) {
        logError('HOTMART_WEBHOOK_SECRET não configurado!');
        return false;
    }

    if (!signature) {
        logSecurityEvent('Webhook sem assinatura recebido');
        return false;
    }

    try {
        // Hotmart usa HMAC-SHA256
        // O payload deve ser stringificado da mesma forma que o Hotmart faz
        const payloadString = typeof payload === 'string'
            ? payload
            : JSON.stringify(payload);

        const hmac = crypto
            .createHmac('sha256', secret)
            .update(payloadString)
            .digest('hex');

        // Comparação segura contra timing attacks
        const isValid = crypto.timingSafeEqual(
            Buffer.from(hmac),
            Buffer.from(signature)
        );

        if (!isValid) {
            logSecurityEvent('Webhook com assinatura inválida', {
                receivedSignature: signature.substring(0, 10) + '...',
                expectedSignature: hmac.substring(0, 10) + '...'
            });
        }

        return isValid;
    } catch (error) {
        logError('Erro ao validar webhook Hotmart', error, {
            signatureLength: signature?.length,
            payloadType: typeof payload
        });
        return false;
    }
}

/**
 * Middleware para validar webhook Hotmart
 * Usar em rotas de webhook
 * 
 * @param {object} req - Request
 * @param {object} res - Response
 * @param {function} next - Next function
 */
export function validateHotmartWebhookMiddleware(req, res, next) {
    const signature = req.headers['x-hotmart-hottok'];
    const secret = process.env.HOTMART_WEBHOOK_SECRET;

    if (!validateHotmartWebhook(req.body, signature, secret)) {
        logSecurityEvent('Webhook Hotmart rejeitado', {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            hasSignature: !!signature,
            hasSecret: !!secret
        });

        return res.status(401).json({
            message: 'Assinatura inválida'
        });
    }

    if (next) next();
}

/**
 * Valida estrutura básica do payload Hotmart
 * Garante que campos obrigatórios estão presentes
 * 
 * @param {object} payload - Payload do webhook
 * @returns {object} { valid: boolean, errors?: string[] }
 */
export function validateHotmartPayload(payload) {
    const errors = [];

    // Campos obrigatórios do Hotmart
    if (!payload.event) {
        errors.push('Campo "event" ausente');
    }

    if (!payload.data) {
        errors.push('Campo "data" ausente');
    }

    if (payload.data && !payload.data.product) {
        errors.push('Campo "data.product" ausente');
    }

    if (payload.data && !payload.data.buyer) {
        errors.push('Campo "data.buyer" ausente');
    }

    return {
        valid: errors.length === 0,
        errors: errors.length > 0 ? errors : undefined
    };
}
