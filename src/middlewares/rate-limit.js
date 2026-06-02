import rateLimit from 'express-rate-limit'

// Rate limiter for authentication endpoints (more strict)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    // In production keep strict limit; in development allow many requests for testing
    max: process.env.NODE_ENV === 'production' ? 5 : 1000,
    message: 'Too many login attempts, please try again later',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
})

// Rate limiter for general API endpoints (less strict)
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
})
