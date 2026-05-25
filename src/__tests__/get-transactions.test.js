import { GetTransactionsController } from '../controllers/get-transactions.js'
import { GetTransactionsUseCase } from '../use-cases/get-transactions.js'

// Mock do use case
jest.mock('../use-cases/get-transactions.js')

describe('GetTransactionsController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        GetTransactionsUseCase.mockImplementation(() => mockUseCase)
        controller = new GetTransactionsController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 403 if user tries to access another user transactions', async () => {
        const httpRequest = {
            params: {
                userId: '550e8400-e29b-41d4-a716-446655440000',
            },
            query: {},
            user: {
                id: '550e8400-e29b-41d4-a716-446655440001',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(403)
        expect(result.body.message).toBe(
            'Forbidden: You can only access your own transactions',
        )
    })

    test('should return 400 if userId is invalid', async () => {
        const httpRequest = {
            params: {
                userId: 'invalid-id',
            },
            query: {},
            user: {
                id: 'invalid-id',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid userId format')
    })

    test('should return 400 if invalid transaction type filter', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: { type: 'INVALID' },
            user: { id: userId },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid transaction type filter')
    })

    test('should return 200 with transactions on success', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: {},
            user: { id: userId },
        }

        const transactions = [
            {
                id: '550e8400-e29b-41d4-a716-446655440001',
                user_id: userId,
                name: 'Salary',
                date: '2024-01-01',
                amount: 1000,
                type: 'EARNING',
            },
        ]

        mockUseCase.execute.mockResolvedValue(transactions)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(transactions)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId, {})
    })

    test('should return 200 with filtered transactions', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: { type: 'EXPENSE', month: '1', year: '2024' },
            user: { id: userId },
        }

        const transactions = []

        mockUseCase.execute.mockResolvedValue(transactions)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(transactions)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId, {
            type: 'EXPENSE',
            month: 1,
            year: 2024,
        })
    })
})
