import { PostgresDeleteTransactionRepository } from '../repositories/postgres/delete-transaction.js'
import { PostgresGetTransactionsRepository } from '../repositories/postgres/get-transactions.js'

export class DeleteTransactionUseCase {
    async execute(transactionId) {
        // Check if transaction exists
        const postgresGetTransactionsRepository =
            new PostgresGetTransactionsRepository()
        const existingTransaction =
            await postgresGetTransactionsRepository.execute(null, {
                id: transactionId,
            })
        if (!existingTransaction || existingTransaction.length === 0) {
            throw new Error('Transaction not found')
        }

        const postgresDeleteTransactionRepository =
            new PostgresDeleteTransactionRepository()
        const deletedTransaction =
            await postgresDeleteTransactionRepository.execute(transactionId)

        return deletedTransaction
    }
}
