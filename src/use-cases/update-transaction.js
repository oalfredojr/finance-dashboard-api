import { PostgresUpdateTransactionRepository } from '../repositories/postgres/update-transaction.js'
import { PostgresGetTransactionsRepository } from '../repositories/postgres/get-transactions.js'

export class UpdateTransactionUseCase {
    async execute(transactionId, updateTransactionParams) {
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
