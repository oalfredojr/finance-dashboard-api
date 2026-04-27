import { v4 as uuidv4 } from 'uuid'
import { PostgresCreateTransactionRepository } from '../repositories/postgres/create-transaction.js'

export class CreateTransactionUseCase {
    async execute(createTransactionParams) {
        // Generate transaction ID
        const transactionId = uuidv4()

        // Validate required fields
        const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']
        for (const field of requiredFields) {
            if (!createTransactionParams[field]) {
                throw new Error(`Missing required field: ${field}`)
            }
        }

        // Validate type
        const validTypes = ['EARNING', 'EXPENSE', 'INVESTMENT']
        if (!validTypes.includes(createTransactionParams.type)) {
            throw new Error('Invalid transaction type')
        }

        // Validate amount
        if (createTransactionParams.amount <= 0) {
            throw new Error('Amount must be greater than 0')
        }

        const transaction = {
            ...createTransactionParams,
            id: transactionId,
        }

        const postgresCreateTransactionRepository =
            new PostgresCreateTransactionRepository()
        const createdTransaction =
            await postgresCreateTransactionRepository.execute(transaction)

        return createdTransaction
    }
}
