import { sanitizeLogMeta } from '../helpers/logger.js'

describe('sanitizeLogMeta', () => {
    test('removes sensitive fields from log metadata', () => {
        const meta = {
            password: 'secret-password',
            token: 'jwt-token',
            authorization: 'Bearer token-123',
            userId: 'user-1',
            requestId: 'abc-123',
        }

        expect(sanitizeLogMeta(meta)).toEqual({
            userId: 'user-1',
            requestId: 'abc-123',
        })
    })

    test('preserves non-sensitive metadata', () => {
        expect(sanitizeLogMeta({ ip: '127.0.0.1', level: 'warn' })).toEqual({
            ip: '127.0.0.1',
            level: 'warn',
        })
    })
})
