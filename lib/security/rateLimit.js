// lib/security/rateLimit.js

/**
 * Rate Limiter Simples em Memória
 * 
 * NOTA: Em produção com múltiplas instâncias serverless, considere usar:
 * - Upstash Redis (https://upstash.com)
 * - Vercel KV (https://vercel.com/storage/kv)
 * 
 * Esta implementação funciona bem para serverless functions individuais.
 */

const rateLimitStore = new Map();

// Configurações padrão
const DEFAULT_WINDOW_MS = 15 * 60 * 1000; // 15 minutos
const DEFAULT_MAX_REQUESTS = 5; // 5 tentativas

/**
 * Limpa entradas antigas do store periodicamente
 */
function cleanup() {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        const recentRequests = data.requests.filter(time => now - time < data.windowMs);
        if (recentRequests.length === 0) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * Verifica se uma requisição está dentro do rate limit
 * 
 * @param {string} identifier - Identificador único (ex: IP, user ID, email)
 * @param {object} options - Opções de configuração
 * @param {number} options.windowMs - Janela de tempo em ms
 * @param {number} options.maxRequests - Máximo de requisições permitidas
 * @returns {object} { allowed: boolean, remaining: number, retryAfter: number }
 */
export function checkRateLimit(identifier, options = {}) {
    const windowMs = options.windowMs || DEFAULT_WINDOW_MS;
    const maxRequests = options.maxRequests || DEFAULT_MAX_REQUESTS;

    const now = Date.now();

    // Busca ou cria registro do identificador
    let record = rateLimitStore.get(identifier);

    if (!record) {
        record = {
            requests: [],
            windowMs,
            maxRequests
        };
        rateLimitStore.set(identifier, record);
    }

    // Remove requisições antigas (fora da janela de tempo)
    record.requests = record.requests.filter(time => now - time < windowMs);

    // Verifica se excedeu o limite
    if (record.requests.length >= maxRequests) {
        const oldestRequest = Math.min(...record.requests);
        const retryAfter = Math.ceil((windowMs - (now - oldestRequest)) / 1000);

        return {
            allowed: false,
            remaining: 0,
            retryAfter,
            resetAt: new Date(oldestRequest + windowMs)
        };
    }

    // Adiciona nova requisição
    record.requests.push(now);

    // Cleanup periódico (a cada 100 verificações)
    if (Math.random() < 0.01) {
        cleanup();
    }

    return {
        allowed: true,
        remaining: maxRequests - record.requests.length,
        retryAfter: 0,
        resetAt: new Date(now + windowMs)
    };
}

/**
 * Extrai IP do cliente da requisição
 * Suporta X-Forwarded-For (Vercel, proxies)
 * 
 * @param {object} req - Request object
 * @returns {string} IP do cliente
 */
export function getClientIp(req) {
    // Vercel/proxies usam X-Forwarded-For
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
        return forwarded.split(',')[0].trim();
    }

    // Cloudflare usa CF-Connecting-IP
    if (req.headers['cf-connecting-ip']) {
        return req.headers['cf-connecting-ip'];
    }

    // Real IP (nginx)
    if (req.headers['x-real-ip']) {
        return req.headers['x-real-ip'];
    }

    // Fallback para connection (local dev)
    return req.connection?.remoteAddress || 'unknown';
}

/**
 * Middleware Express/Serverless para rate limiting
 * 
 * @param {object} options - Configuração do rate limiter
 * @returns {function} Middleware function
 */
export function rateLimitMiddleware(options = {}) {
    return (req, res, next) => {
        const identifier = options.keyGenerator
            ? options.keyGenerator(req)
            : getClientIp(req);

        const result = checkRateLimit(identifier, options);

        // Headers informativos
        res.setHeader('X-RateLimit-Limit', options.maxRequests || DEFAULT_MAX_REQUESTS);
        res.setHeader('X-RateLimit-Remaining', result.remaining);
        res.setHeader('X-RateLimit-Reset', result.resetAt.toISOString());

        if (!result.allowed) {
            res.setHeader('Retry-After', result.retryAfter);
            return res.status(429).json({
                message: 'Muitas tentativas. Tente novamente mais tarde.',
                retryAfter: result.retryAfter
            });
        }

        if (next) next();
        return result;
    };
}

// Configurações pré-definidas para diferentes casos de uso
export const rateLimitConfigs = {
    // Login: 5 tentativas a cada 15 minutos
    login: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 5,
        keyGenerator: (req) => {
            // Rate limit por IP + email para evitar bypass
            const ip = getClientIp(req);
            const email = req.body?.email || 'unknown';
            return `login:${ip}:${email.toLowerCase()}`;
        }
    },

    // Registro: 3 cadastros por hora por IP
    register: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3,
        keyGenerator: (req) => `register:${getClientIp(req)}`
    },

    // Forgot Password: 3 pedidos por hora por email
    forgotPassword: {
        windowMs: 60 * 60 * 1000,
        maxRequests: 3,
        keyGenerator: (req) => {
            const email = req.body?.email || 'unknown';
            return `forgot:${email.toLowerCase()}`;
        }
    },

    // API Geral: 100 requisições por 15 minutos
    api: {
        windowMs: 15 * 60 * 1000,
        maxRequests: 100,
        keyGenerator: (req) => `api:${getClientIp(req)}`
    }
};
