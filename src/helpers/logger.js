import winston from 'winston'

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.json(),
    ),
    defaultMeta: { service: 'finance-api' },
    transports: [
        // Console transport
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(
                    ({ timestamp, level, message, service, ...meta }) => {
                        let metaStr = ''
                        if (Object.keys(meta).length > 0) {
                            metaStr = JSON.stringify(meta)
                        }
                        return `[${timestamp}] ${level} (${service}): ${message} ${metaStr}`
                    },
                ),
            ),
        }),
        // Error file transport
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        // Combined file transport
        new winston.transports.File({ filename: 'combined.log' }),
    ],
})

export default logger
