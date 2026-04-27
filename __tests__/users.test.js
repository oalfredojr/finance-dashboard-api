import request from 'supertest'
import express from 'express'
import { jest } from '@jest/globals'
import usersRouter from '../src/routes/users.js'
import { PostgresHelper } from '../src/db/postgres/helper.js'

jest.mock('../src/db/postgres/helper.js', () => ({
    PostgresHelper: {
        query: jest.fn(),
    },
}))

describe('Users API', () => {
    let app

    beforeEach(() => {
        app = express()
        app.use(express.json())
        app.use('/api/users', usersRouter)
    })

    describe('POST /api/users', () => {
        it('should create a user successfully', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: 'password123',
            }

            PostgresHelper.query
                .mockResolvedValueOnce([]) // No existing user
                .mockResolvedValueOnce([{ id: '123', ...userData }]) // Created user

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(201)

            expect(response.body).toHaveProperty('id')
            expect(response.body.email).toBe(userData.email)
        })

        it('should return 400 for invalid email', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'invalid-email',
                password: 'password123',
            }

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(400)

            expect(response.body.message).toBe('Invalid email format.')
        })

        it('should return 400 for short password', async () => {
            const userData = {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john.doe@example.com',
                password: '123',
            }

            const response = await request(app)
                .post('/api/users')
                .send(userData)
                .expect(400)

            expect(response.body.message).toBe(
                'Password must be at least 6 characters long.',
            )
        })
    })
})
