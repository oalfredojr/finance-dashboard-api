import { CreateTransactionUseCase } from '../use-cases/create-transaction.js'

// Mock repositories
jest.mock('../repositories/postgres/get-user-by-id.js')
jest.mock('../repositories/postgres/create-transaction.js')

import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'
import { PostgresCreateTransactionRepository } from '../repositories/postgres/create-transaction.js'

describe('CreateTransactionUseCase', () => {
    let useCase
    let mockGetUser
    let mockCreateTransaction

    beforeEach(() => {
        mockGetUser = { execute: jest.fn() }
        mockCreateTransaction = { execute: jest.fn() }

        PostgresGetUserByIdRepository.mockImplementation(() => mockGetUser)
        PostgresCreateTransactionRepository.mockImplementation(
            () => mockCreateTransaction,
        )

        useCase = new CreateTransactionUseCase()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should throw when user does not exist', async () => {
        mockGetUser.execute.mockResolvedValue(null)

        const params = {
            user_id: '550e8400-e29b-41d4-a716-446655440000',
            name: 'Test',
            date: '2024-01-01',
            amount: 10,
            type: 'EARNING',
        }

        await expect(useCase.execute(params)).rejects.toThrow('User not found')
    })

    test('should create transaction when user exists', async () => {
        const user = { id: '550e8400-e29b-41d4-a716-446655440000' }
        mockGetUser.execute.mockResolvedValue(user)

        const createdTransaction = {
            id: 'tx-1',
            user_id: user.id,
            name: 'Salary',
            date: '2024-01-01',
            amount: 1000,
            type: 'EARNING',
        }

        mockCreateTransaction.execute.mockResolvedValue(createdTransaction)

        const params = {
            user_id: user.id,
            name: 'Salary',
            date: '2024-01-01',
            amount: 1000,
            type: 'EARNING',
        }

        const result = await useCase.execute(params)

        expect(result).toEqual(createdTransaction)
        expect(mockCreateTransaction.execute).toHaveBeenCalled()
    })
})
