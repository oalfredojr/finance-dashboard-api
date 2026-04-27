import { GetTransactionsUseCase } from '../use-cases/get-transactions.js'
import { badRequest, ok, serverError } from '../helpers/http-helper.js'
import validator from 'validator'

export class GetTransactionsController {
    async execute(httpRequest) {
        try {
            const { userId } = httpRequest.params
            const { type, month, year, limit } = httpRequest.query

            // Validate userId
            if (!validator.isUUID(userId)) {
                return badRequest({ message: 'Invalid userId format' })
            }

            // Validate filters
            const filters = {}

            if (type) {
                const validTypes = ['EARNING', 'EXPENSE', 'INVESTMENT']
                if (!validTypes.includes(type)) {
                    return badRequest({
                        message: 'Invalid transaction type filter',
                    })
                }
                filters.type = type
            }

            if (month && year) {
                const monthNum = parseInt(month)
                const yearNum = parseInt(year)
                if (
                    monthNum < 1 ||
                    monthNum > 12 ||
                    yearNum < 2000 ||
                    yearNum > 2100
                ) {
                    return badRequest({ message: 'Invalid month/year filter' })
                }
                filters.month = monthNum
                filters.year = yearNum
            }

            if (limit) {
                const limitNum = parseInt(limit)
                if (limitNum < 1 || limitNum > 100) {
                    return badRequest({
                        message: 'Limit must be between 1 and 100',
                    })
                }
                filters.limit = limitNum
            }

            const getTransactionsUseCase = new GetTransactionsUseCase()
            const transactions = await getTransactionsUseCase.execute(
                userId,
                filters,
            )

            return ok(transactions)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
