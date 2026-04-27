import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresGetTransactionsRepository {
    async execute(userId, filters = {}) {
        let query = 'SELECT * FROM transactions WHERE user_id = $1'
        const params = [userId]
        let paramIndex = 2

        if (filters.type) {
            query += ` AND type = $${paramIndex}`
            params.push(filters.type)
            paramIndex++
        }

        if (filters.month && filters.year) {
            query += ` AND EXTRACT(MONTH FROM date) = $${paramIndex} AND EXTRACT(YEAR FROM date) = $${paramIndex + 1}`
            params.push(filters.month, filters.year)
            paramIndex += 2
        }

        query += ' ORDER BY date DESC'

        if (filters.limit) {
            query += ` LIMIT $${paramIndex}`
            params.push(filters.limit)
        }

        const transactions = await PostgresHelper.query(query, params)
        return transactions
    }
}
