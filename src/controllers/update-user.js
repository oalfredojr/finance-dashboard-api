import { UpdateUserCase } from '../use-cases/update-user.js'
import {
    badRequest,
    notFound,
    ok,
    serverError,
} from '../helpers/http-helper.js'
import validator from 'validator'
import { EmailALreadyExistsError } from '../errors/user.js'

export class UpdateUserController {
    async execute(httpRequest) {
        try {
            const isIdValid = validator.isUUID(httpRequest.params.userId)

            if (!isIdValid) {
                return badRequest({ message: 'The provided id is not valid.' })
            }

            const params = httpRequest.body

            // Optional validation: ensure at least one field is provided
            if (!params || Object.keys(params).length === 0) {
                return badRequest({
                    message: 'At least one field must be provided to update.',
                })
            }

            // Validate email if provided
            if (params.email && !validator.isEmail(params.email)) {
                return badRequest({ message: 'Invalid email format.' })
            }

            // Validate password if provided
            if (params.password && params.password.length < 6) {
                return badRequest({
                    message: 'Password must be at least 6 characters long.',
                })
            }

            const updateUserCase = new UpdateUserCase()

            const updatedUser = await updateUserCase.execute(
                httpRequest.params.userId,
                params,
            )

            if (!updatedUser) {
                return notFound({ message: 'User not found.' })
            }

            return ok(updatedUser)
        } catch (error) {
            if (error instanceof EmailALreadyExistsError) {
                return badRequest({ message: error.message })
            }
            if (error.message === 'User not found') {
                return notFound({ message: error.message })
            }
            console.error(error)
            return serverError()
        }
    }
}
