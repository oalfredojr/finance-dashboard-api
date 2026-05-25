import { authMiddleware } from '../middlewares/auth.js'
import jwt from 'jsonwebtoken'

// Mock do JWT
jest.mock('jsonwebtoken')

describe('authMiddleware', () => {
    let req, res, next

    beforeEach(() => {
        req = {
            headers: {
                authorization: '',
            },
            ip: '127.0.0.1',
        }
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        }
        next = jest.fn()
        jest.clearAllMocks()
    })

    test('should return 401 if authorization header is missing', () => {
        req.headers.authorization = undefined

        authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Authorization header missing',
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should return 401 if token is missing', () => {
        req.headers.authorization = 'Bearer'

        authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token missing',
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should return 401 if token is expired', () => {
        const token = 'valid-token'
        req.headers.authorization = `Bearer ${token}`

        const error = new Error('Token expired')
        error.name = 'TokenExpiredError'
        jwt.verify.mockImplementation(() => {
            throw error
        })

        authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Token expired',
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should return 401 if token is invalid', () => {
        const token = 'invalid-token'
        req.headers.authorization = `Bearer ${token}`

        const error = new Error('Invalid token')
        error.name = 'JsonWebTokenError'
        jwt.verify.mockImplementation(() => {
            throw error
        })

        authMiddleware(req, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Invalid token',
        })
        expect(next).not.toHaveBeenCalled()
    })

    test('should call next and set req.user on successful verification', () => {
        const token = 'valid-token'
        const decoded = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: 'user@example.com',
            iat: 1234567890,
            exp: 1234571490,
        }

        req.headers.authorization = `Bearer ${token}`
        jwt.verify.mockImplementation(() => decoded)
        process.env.JWT_SECRET = 'test-secret'

        authMiddleware(req, res, next)

        expect(jwt.verify).toHaveBeenCalledWith(token, 'test-secret')
        expect(req.user).toEqual(decoded)
        expect(next).toHaveBeenCalled()
        expect(res.status).not.toHaveBeenCalled()
    })
})
