import { CreateTransactionUseCase } from '../use-cases/create-transaction.js'
import { badRequest, created, serverError } from '../helpers/http-helper.js'
import validator from 'validator'

export class CreateTransactionController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['user_id', 'name', 'date', 'amount', 'type']

            for (const field of requiredFields) {
                if (
                    !params[field] ||
                    (typeof params[field] === 'string' &&
                        params[field].trim().length === 0)
                ) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            // Validate user_id is UUID
            if (!validator.isUUID(params.user_id)) {
                return badRequest({ message: 'Invalid user_id format' })
            }

            // Validate date
            if (!validator.isISO8601(params.date)) {
                return badRequest({
                    message: 'Invalid date format (use ISO 8601)',
                })
            }

            // Validate amount
            if (typeof params.amount !== 'number' || params.amount <= 0) {
                return badRequest({
                    message: 'Amount must be a positive number',
                })
            }

            // Validate type
            const validTypes = ['EARNING', 'EXPENSE', 'INVESTMENT']
            if (!validTypes.includes(params.type)) {
                return badRequest({ message: 'Invalid transaction type' })
            }

            const createTransactionUseCase = new CreateTransactionUseCase()
            const createdTransaction =
                await createTransactionUseCase.execute(params)

            return created(createdTransaction)
        } catch (error) {
            console.error(error)
            if (
                error.message.includes('Missing required field') ||
                error.message.includes('Invalid') ||
                error.message.includes('must be greater than')
            ) {
                return badRequest({ message: error.message })
            }
            return serverError()
        }
    }
}
