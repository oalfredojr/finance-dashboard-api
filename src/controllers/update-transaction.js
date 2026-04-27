import { UpdateTransactionUseCase } from '../use-cases/update-transaction.js'
import {
    badRequest,
    notFound,
    ok,
    serverError,
} from '../helpers/http-helper.js'
import validator from 'validator'

export class UpdateTransactionController {
    async execute(httpRequest) {
        try {
            const { transactionId } = httpRequest.params
            const params = httpRequest.body

            // Validate transactionId
            if (!validator.isUUID(transactionId)) {
                return badRequest({ message: 'Invalid transactionId format' })
            }

            // Check if at least one field is provided
            if (!params || Object.keys(params).length === 0) {
                return badRequest({
                    message: 'At least one field must be provided to update',
                })
            }

            // Validate date if provided
            if (params.date && !validator.isISO8601(params.date)) {
                return badRequest({
                    message: 'Invalid date format (use ISO 8601)',
                })
            }

            // Validate amount if provided
            if (
                params.amount !== undefined &&
                (typeof params.amount !== 'number' || params.amount <= 0)
            ) {
                return badRequest({
                    message: 'Amount must be a positive number',
                })
            }

            // Validate type if provided
            if (params.type) {
                const validTypes = ['EARNING', 'EXPENSE', 'INVESTMENT']
                if (!validTypes.includes(params.type)) {
                    return badRequest({ message: 'Invalid transaction type' })
                }
            }

            const updateTransactionUseCase = new UpdateTransactionUseCase()
            const updatedTransaction = await updateTransactionUseCase.execute(
                transactionId,
                params,
            )

            if (!updatedTransaction) {
                return notFound({ message: 'Transaction not found' })
            }

            return ok(updatedTransaction)
        } catch (error) {
            console.error(error)
            if (error.message === 'Transaction not found') {
                return notFound({ message: error.message })
            }
            if (
                error.message.includes('Invalid') ||
                error.message.includes('must be')
            ) {
                return badRequest({ message: error.message })
            }
            return serverError()
        }
    }
}
