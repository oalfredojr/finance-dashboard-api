import winston from 'winston'

const sensitiveFieldPatterns = [
    'password',
    'secret',
    'token',
    'authorization',
    'cookie',
    'set-cookie',
    'jwt',
]

export const sanitizeLogMeta = (meta = {}) => {
    if (!meta || typeof meta !== 'object' || Array.isArray(meta)) {
        return {}
    }

    return Object.entries(meta).reduce((acc, [key, value]) => {
        const normalizedKey = key.toLowerCase()
        const isSensitive =
            sensitiveFieldPatterns.some(
                (pattern) =>
                    normalizedKey.includes(pattern) ||
                    normalizedKey === pattern,
            ) || normalizedKey.includes('secret')

        if (isSensitive) {
            return acc
        }

        if (value && typeof value === 'object') {
            const sanitizedValue = sanitizeLogMeta(value)
            if (Object.keys(sanitizedValue).length > 0) {
                acc[key] = sanitizedValue
            }
            return acc
        }

        acc[key] = value
        return acc
    }, {})
}

const redactSensitiveFields = winston.format((info) => {
    const sanitizedInfo = sanitizeLogMeta(info)
    Object.keys(info).forEach((key) => delete info[key])
    Object.assign(info, sanitizedInfo)
    return info
})()

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        redactSensitiveFields,
        winston.format.json(),
    ),
    defaultMeta: { service: 'finance-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message, service, ...meta }) => {
                        const sanitizedMeta = sanitizeLogMeta(meta)
                        let metaStr = ''
                        if (Object.keys(sanitizedMeta).length > 0) {
                            metaStr = JSON.stringify(sanitizedMeta)
                        }
                        return `[${timestamp}] ${level} (${service}): ${message} ${metaStr}`
                    },
                ),
            ),
        }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

export default logger
