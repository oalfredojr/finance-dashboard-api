import { GetUserByIdController } from '../controllers/get-user-by-id.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'

// Mock do use case
jest.mock('../use-cases/get-user-by-id.js')

describe('GetUserByIdController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        GetUserByIdUseCase.mockImplementation(() => mockUseCase)
        controller = new GetUserByIdController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 403 if user tries to access another user data', async () => {
        const httpRequest = {
            params: {
                userId: '550e8400-e29b-41d4-a716-446655440000',
            },
            user: {
                id: '550e8400-e29b-41d4-a716-446655440001',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(403)
        expect(result.body.message).toBe(
            'Forbidden: You can only access your own data',
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
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('The provide id is not valid.')
    })

    test('should return 404 if user not found', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
        }

        mockUseCase.execute.mockResolvedValue(null)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe('User not found.')
    })

    test('should return 200 with user data on success', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            user: { id: userId },
        }

        const userData = {
            id: userId,
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        }

        mockUseCase.execute.mockResolvedValue(userData)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(userData)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId)
    })
})
