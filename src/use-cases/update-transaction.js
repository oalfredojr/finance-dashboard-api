import { PostgresUpdateTransactionRepository } from '../repositories/postgres/update-transaction.js'
import { PostgresGetTransactionsRepository } from '../repositories/postgres/get-transactions.js'

export class UpdateTransactionUseCase {
    async execute(transactionId, userId, updateTransactionParams) {
        // Check if transaction exists and belongs to user
        const postgresGetTransactionsRepository =
            new PostgresGetTransactionsRepository()
        const existingTransaction =
            await postgresGetTransactionsRepository.execute(userId, {
                transactionId,
            })
        if (!existingTransaction || existingTransaction.length === 0) {
            throw new Error('Transaction not found')
        }

        // Verify transaction belongs to user
        if (existingTransaction[0].user_id !== userId) {
            throw new Error(
                'Unauthorized: Transaction does not belong to this user',
            )
        }

        // Validate type if provided
        if (updateTransactionParams.type) {
            const validTypes = ['EARNING', 'EXPENSE', 'INVESTMENT']
            if (!validTypes.includes(updateTransactionParams.type)) {
                throw new Error('Invalid transaction type')
            }
        }

        // Validate amount if provided
        if (
            updateTransactionParams.amount !== undefined &&
            updateTransactionParams.amount <= 0
        ) {
            throw new Error('Amount must be greater than 0')
        }

        const postgresUpdateTransactionRepository =
            new PostgresUpdateTransactionRepository()
        const updatedTransaction =
            await postgresUpdateTransactionRepository.execute(
                transactionId,
                updateTransactionParams,
            )

        return updatedTransaction
    }
}
