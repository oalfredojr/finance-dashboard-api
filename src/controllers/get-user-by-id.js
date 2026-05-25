import {
    badRequest,
    notFound,
    ok,
    serverError,
} from '../helpers/http-helper.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator' // Importação correta do validator

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({ message: 'The provide id is not valid.' })
            }

            // Authorization check: user can only access their own data
            if (httpRequest.user.id !== httpRequest.params.userId) {
                return {
                    statusCode: 403,
                    body: {
                        message: 'Forbidden: You can only access your own data',
                    },
                }
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            if (!user) {
                return notFound({ message: 'User not found.' })
            }

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
