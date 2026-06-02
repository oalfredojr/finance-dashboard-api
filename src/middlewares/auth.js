import jwt from 'jsonwebtoken'
import logger from '../helpers/logger.js'

export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization

        if (!authHeader) {
            logger.warn('Authorization header missing', { ip: req.ip })
            return res
                .status(401)
                .json({ message: 'Authorization header missing' })
        }

        const token = authHeader.split(' ')[1] // Bearer TOKEN

        if (!token) {
            logger.warn('Token missing in authorization header', { ip: req.ip })
            return res.status(401).json({ message: 'Token missing' })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded // { id, email, iat, exp }

        logger.info('User authenticated successfully', { userId: decoded.id })
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            logger.warn('Token expired', { error: error.message })
            return res.status(401).json({ message: 'Token expired' })
        }
        if (error.name === 'JsonWebTokenError') {
            logger.warn('Invalid token', { error: error.message })
            return res.status(401).json({ message: 'Invalid token' })
        }
        logger.error('Authentication error', { error: error.message })
        return res.status(500).json({ message: 'Authentication error' })
    }
}
