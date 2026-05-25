import { UpdateTransactionController } from '../controllers/update-transaction.js'
import { UpdateTransactionUseCase } from '../use-cases/update-transaction.js'

// Mock do use case
jest.mock('../use-cases/update-transaction.js')

describe('UpdateTransactionController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        UpdateTransactionUseCase.mockImplementation(() => mockUseCase)
        controller = new UpdateTransactionController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 400 if transactionId is invalid', async () => {
        const httpRequest = {
            params: {
                transactionId: 'invalid-id',
            },
            user: {
                id: '550e8400-e29b-41d4-a716-446655440000',
            },
            body: {
                amount: 100,
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid transactionId format')
    })

    test('should return 400 if no body provided', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { transactionId },
            user: { id: '550e8400-e29b-41d4-a716-446655440001' },
            body: {},
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            'At least one field must be provided to update',
        )
    })

    test('should return 403 if transaction does not belong to user', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
            body: { amount: 100 },
        }

        mockUseCase.execute.mockRejectedValue(
            new Error('Unauthorized: Transaction does not belong to this user'),
        )

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(403)
        expect(result.body.message).toBe(
            'Unauthorized: Transaction does not belong to this user',
        )
    })

    test('should return 200 on successful update', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
            body: { amount: 150 },
        }

        const updatedTransaction = {
            id: transactionId,
            user_id: userId,
            name: 'Transaction',
            date: '2024-01-01',
            amount: 150,
            type: 'EXPENSE',
        }

        mockUseCase.execute.mockResolvedValue(updatedTransaction)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(updatedTransaction)
        expect(mockUseCase.execute).toHaveBeenCalledWith(
            transactionId,
            userId,
            { amount: 150 },
        )
    })

    test('should return 400 if invalid transaction type', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
            body: { type: 'INVALID' },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid transaction type')
    })
})
