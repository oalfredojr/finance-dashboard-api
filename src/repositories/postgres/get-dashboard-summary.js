import { PostgresHelper } from '../../db/postgres/helper.js'

export class PostgresGetDashboardSummaryRepository {
    async execute(userId, filters = {}) {
        let dateFilter = ''
        const params = [userId]
        let paramIndex = 2

        if (filters.month && filters.year) {
            dateFilter = `AND EXTRACT(MONTH FROM date) = $${paramIndex} AND EXTRACT(YEAR FROM date) = $${paramIndex + 1}`
            params.push(filters.month, filters.year)
        }

        // Total balance (earnings - expenses - investments)
        const balanceQuery = `
            SELECT
                COALESCE(SUM(CASE WHEN type = 'EARNING' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN type = 'INVESTMENT' THEN amount ELSE 0 END), 0) as balance
            FROM transactions
            WHERE user_id = $1 ${dateFilter}
        `

        // Totals by type
        const totalsQuery = `
            SELECT
                type,
                SUM(amount) as total
            FROM transactions
            WHERE user_id = $1 ${dateFilter}
            GROUP BY type
        `

        // Category breakdown (simplified - using name as category for now)
        const categoriesQuery = `
            SELECT
                name as category,
                type,
                SUM(amount) as total
            FROM transactions
            WHERE user_id = $1 ${dateFilter}
            GROUP BY name, type
            ORDER BY total DESC
            LIMIT 10
        `

        const [balanceResult] = await PostgresHelper.query(balanceQuery, params)
        const totalsResult = await PostgresHelper.query(totalsQuery, params)
        const categoriesResult = await PostgresHelper.query(
            categoriesQuery,
            params,
        )

        // Format the response
        const totals = {
            EARNING: 0,
            EXPENSE: 0,
            INVESTMENT: 0,
        }

        totalsResult.forEach((row) => {
            totals[row.type] = parseFloat(row.total)
        })

        return {
            balance: parseFloat(balanceResult.balance),
            totals,
            categories: categoriesResult.map((cat) => ({
                category: cat.category,
                type: cat.type,
                total: parseFloat(cat.total),
            })),
        }
    }
}
