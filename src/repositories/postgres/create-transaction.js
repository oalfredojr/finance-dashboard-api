import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresCreateTransactionRepository {
    async execute(createTransactionParams) {
        await PostgresHelper.query(
            'INSERT INTO transactions (id, user_id, name, date, amount, type) VALUES ($1, $2, $3, $4, $5, $6);',
            [
                createTransactionParams.id,
                createTransactionParams.user_id,
                createTransactionParams.name,
                createTransactionParams.date,
                createTransactionParams.amount,
                createTransactionParams.type,
            ],
        )

        const createdTransaction = await PostgresHelper.query(
            'SELECT * FROM transactions WHERE id = $1;',
            [createTransactionParams.id],
        )
        return createdTransaction[0]
    }
}
