// lib/logger.js
import winston from 'winston';

// Formato personalizado com timestamp e cores
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
);

// Criar logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: customFormat,
    defaultMeta: { service: 'foca-ai' },
    transports: [
        // Erros em arquivo separado (apenas em produção local, Vercel usa stdout)
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ level, message, timestamp, stack, ...metadata }) => {
                    let msg = `${timestamp} [${level}]: ${message}`;

                    // Adiciona stack trace se houver
                    if (stack) {
                        msg += `\n${stack}`;
                    }

                    // Adiciona metadata se houver
                    if (Object.keys(metadata).length > 0) {
                        msg += `\n${JSON.stringify(metadata, null, 2)}`;
                    }

                    return msg;
                })
            )
        })
    ]
});

// Helper functions para facilitar uso
export const logInfo = (message, metadata = {}) => {
    logger.info(message, metadata);
};

export const logError = (message, error = null, metadata = {}) => {
    if (error) {
        logger.error(message, {
            error: error.message,
            stack: error.stack,
            ...metadata
        });
    } else {
        logger.error(message, metadata);
    }
};

export const logWarn = (message, metadata = {}) => {
    logger.warn(message, metadata);
};

export const logDebug = (message, metadata = {}) => {
    logger.debug(message, metadata);
};

// Logger para eventos de segurança (auditoria)
export const logSecurityEvent = (event, metadata = {}) => {
    logger.warn(`[SECURITY] ${event}`, {
        timestamp: new Date().toISOString(),
        ...metadata
    });
};

export default logger;
