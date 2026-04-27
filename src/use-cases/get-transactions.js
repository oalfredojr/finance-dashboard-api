import { PostgresGetTransactionsRepository } from '../repositories/postgres/get-transactions.js'

export class GetTransactionsUseCase {
    async execute(userId, filters = {}) {
        const postgresGetTransactionsRepository =
            new PostgresGetTransactionsRepository()
        const transactions = await postgresGetTransactionsRepository.execute(
            userId,
            filters,
        )

        return transactions
    }
}
