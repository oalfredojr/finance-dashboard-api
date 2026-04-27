import { LoginUseCase } from '../use-cases/login.js'
import { badRequest, ok, serverError } from '../helpers/http-helper.js'
import validator from 'validator'

export class LoginController {
    async execute(httpRequest) {
        try {
            const params = httpRequest.body

            const requiredFields = ['email', 'password']

            for (const field of requiredFields) {
                if (!params[field] || params[field].trim().length === 0) {
                    return badRequest({ message: `Missing param: ${field}` })
                }
            }

            // Validate email format
            const emailIsValid = validator.isEmail(params.email)
            if (!emailIsValid) {
                return badRequest({ message: 'Invalid email format.' })
            }

            const loginUseCase = new LoginUseCase()
            const result = await loginUseCase.execute(params)

            return ok(result)
        } catch (error) {
            console.error(error)
            if (error.message === 'Invalid credentials') {
                return badRequest({ message: 'Invalid email or password' })
            }
            if (error.message.includes('Missing required field')) {
                return badRequest({ message: error.message })
            }
            return serverError()
        }
    }
}
