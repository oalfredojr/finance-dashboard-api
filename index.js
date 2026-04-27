import 'dotenv/config.js'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import usersRouter from './src/routes/users.js'
import transactionsRouter from './src/routes/transactions.js'

const app = express()

// Security middleware
app.use(helmet())
app.use(cors())

// Body parsing
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// mount routers
app.use('/api/users', usersRouter)
app.use('/api/transactions', transactionsRouter)

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Internal server error' })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
