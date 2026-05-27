import { DeleteTransactionController } from '../controllers/delete-transaction.js'
import { DeleteTransactionUseCase } from '../use-cases/delete-transaction.js'

// Mock do use case
jest.mock('../use-cases/delete-transaction.js')

describe('DeleteTransactionController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        DeleteTransactionUseCase.mockImplementation(() => mockUseCase)
        controller = new DeleteTransactionController()
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
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid transactionId format')
    })

    test('should return 403 if transaction does not belong to user', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
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

    test('should return 404 if transaction not found', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
        }

        mockUseCase.execute.mockResolvedValue(null)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(404)
        expect(result.body.message).toBe('Transaction not found')
    })

    test('should return 200 on successful delete', async () => {
        const transactionId = '550e8400-e29b-41d4-a716-446655440000'
        const userId = '550e8400-e29b-41d4-a716-446655440001'
        const httpRequest = {
            params: { transactionId },
            user: { id: userId },
        }

        const deletedTransaction = {
            id: transactionId,
            user_id: userId,
            name: 'Transaction',
            date: '2024-01-01',
            amount: 100,
            type: 'EXPENSE',
        }

        mockUseCase.execute.mockResolvedValue(deletedTransaction)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body.message).toBe('Transaction deleted successfully')
        expect(result.body.transaction).toEqual(deletedTransaction)
        expect(mockUseCase.execute).toHaveBeenCalledWith(transactionId, userId)
    })
})
