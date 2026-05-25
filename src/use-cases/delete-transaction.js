import { PostgresDeleteTransactionRepository } from '../repositories/postgres/delete-transaction.js'
import { PostgresGetTransactionsRepository } from '../repositories/postgres/get-transactions.js'

export class DeleteTransactionUseCase {
    async execute(transactionId, userId) {
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

        const postgresDeleteTransactionRepository =
            new PostgresDeleteTransactionRepository()
        const deletedTransaction =
            await postgresDeleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
