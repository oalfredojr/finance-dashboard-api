import request from 'supertest'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'

// Mock das rotas para teste isolado
const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' })
})

// Error handler
app.use((err, req, res) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Internal server error' })
})

describe('Health Check', () => {
    test('GET /health should return OK status', async () => {
        const response = await request(app).get('/health').expect(200)

        expect(response.body).toHaveProperty('status', 'OK')
        expect(response.body).toHaveProperty('timestamp')
        expect(typeof response.body.timestamp).toBe('string')
    })

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app).get('/nonexistent').expect(404)

        expect(response.body).toHaveProperty('message', 'Route not found')
    })
})
