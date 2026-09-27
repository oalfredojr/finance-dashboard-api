import cors from 'cors'
import express from 'express'
import request from 'supertest'
import { createCorsOptions } from '../helpers/cors-options.js'

describe('CORS origin allowlist', () => {
    const app = express()

    app.use(cors(createCorsOptions(['https://app.example.com'])))
    app.get('/resource', (req, res) => res.status(200).json({ ok: true }))

    test('allows configured browser origins', async () => {
        const response = await request(app)
            .get('/resource')
            .set('Origin', 'https://app.example.com')
            .expect(200)

        expect(response.headers['access-control-allow-origin']).toBe(
            'https://app.example.com',
        )
    })

    test('does not allow unconfigured browser origins', async () => {
        const response = await request(app)
            .get('/resource')
            .set('Origin', 'https://untrusted.example')
            .expect(200)

        expect(response.headers['access-control-allow-origin']).toBeUndefined()
    })
})
