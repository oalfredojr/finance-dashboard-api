import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresDeleteTransactionRepository {
    async execute(transactionId) {
        const result = await PostgresHelper.query(
            'DELETE FROM transactions WHERE id = $1 RETURNING *;',
            [transactionId],
        )
        return result[0]
    }
}
