import { badRequest, ok, serverError } from '../helpers/http-helper.js'
import { GetUserByIdUseCase } from '../use-cases/get-user-by-id.js'
import validator from 'validator' // Importação correta do validator

export class GetUserByIdController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({ message: 'The provide id is not valid.' })
            }

            const getUserByIdUseCase = new GetUserByIdUseCase()

            const user = await getUserByIdUseCase.execute(
                httpRequest.params.userId,
            )

            return ok(user)
        } catch (error) {
            console.log(error)
            return serverError()
        }
    }
}
