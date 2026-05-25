import { UpdateUserController } from '../controllers/update-user.js'
import { UpdateUserCase } from '../use-cases/update-user.js'
import { EmailALreadyExistsError } from '../errors/user.js'

// Mock do use case
jest.mock('../use-cases/update-user.js')

describe('UpdateUserController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        UpdateUserCase.mockImplementation(() => mockUseCase)
        controller = new UpdateUserController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 403 if user tries to update another user', async () => {
        const httpRequest = {
            params: {
                userId: '550e8400-e29b-41d4-a716-446655440000',
            },
            user: {
                id: '550e8400-e29b-41d4-a716-446655440001',
            },
            body: {
                first_name: 'Jane',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(403)
        expect(result.body.message).toBe(
            'Forbidden: You can only update your own data',
        )
    })

    test('should return 400 if userId is invalid', async () => {
        const httpRequest = {
            params: {
                userId: 'invalid-id',
            },
            user: {
                id: 'invalid-id',
            },
            body: {
                first_name: 'Jane',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('The provided id is not valid.')
    })

    test('should return 400 if no body provided', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
            body: {},
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            'At least one field must be provided to update.',
        )
    })

    test('should return 400 if email is invalid', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
            body: {
                email: 'invalid-email',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid email format.')
    })

    test('should return 400 if password is too short', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
            body: {
                password: '123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            'Password must be at least 6 characters long.',
        )
    })

    test('should return 200 on successful update', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
            body: {
                first_name: 'Jane',
            },
        }

        const updatedUser = {
            id: userId,
            first_name: 'Jane',
            last_name: 'Doe',
            email: 'john@example.com',
        }

        mockUseCase.execute.mockResolvedValue(updatedUser)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(updatedUser)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId, {
            first_name: 'Jane',
        })
    })

    test('should return 409 if email already exists', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
            body: {
                email: 'existing@example.com',
            },
        }

        mockUseCase.execute.mockRejectedValue(
            new EmailALreadyExistsError('existing@example.com'),
        )

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toContain('already in use')
    })
})
