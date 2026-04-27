import { DeleteTransactionUseCase } from '../use-cases/delete-transaction.js'
import {
    badRequest,
    notFound,
    ok,
    serverError,
} from '../helpers/http-helper.js'
import validator from 'validator'

export class DeleteTransactionController {
    async execute(httpRequest) {
        try {
            const { transactionId } = httpRequest.params

            // Validate transactionId
            if (!validator.isUUID(transactionId)) {
                return badRequest({ message: 'Invalid transactionId format' })
            }

            const deleteTransactionUseCase = new DeleteTransactionUseCase()
            const deletedTransaction =
                await deleteTransactionUseCase.execute(transactionId)

            if (!deletedTransaction) {
                return notFound({ message: 'Transaction not found' })
            }

            return ok({
                message: 'Transaction deleted successfully',
                transaction: deletedTransaction,
            })
        } catch (error) {
            console.error(error)
            if (error.message === 'Transaction not found') {
                return notFound({ message: error.message })
            }
            return serverError()
        }
    }
}
