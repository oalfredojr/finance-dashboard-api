import 'dotenv/config.js'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import usersRouter from './src/routes/users.js'
import transactionsRouter from './src/routes/transactions.js'
import authRouter from './src/routes/auth.js'
import { authMiddleware } from './src/middlewares/auth.js'
import { apiLimiter } from './src/middlewares/rate-limit.js'
import logger from './src/helpers/logger.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Rate limiting for all API endpoints
app.use(apiLimiter)

// Body parsing
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// mount routers
app.use('/api/auth', authRouter)
app.use('/api/users', authMiddleware, usersRouter)
app.use('/api/transactions', authMiddleware, transactionsRouter)

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
    logger.error('Unhandled error', { error: err?.message, stack: err?.stack })
    res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    logger.info(`Server listening on port ${PORT}`)
})
