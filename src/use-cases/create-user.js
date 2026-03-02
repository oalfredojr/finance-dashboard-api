import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class CreateUserCase {
    async execute(createUserPARAMS) {
        // TODO: verificar se o e-mail já esta em uso
        const postgresCreateUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const userWithProvidedEmail =
            await postgresCreateUserByEmailRepository.execute(
                createUserPARAMS.email,
            )

        if (userWithProvidedEmail) {
            throw new Error('The provided email is already in use.')
        }
        // gerar ID do usuário
        const userId = uuidv4()
        // criptografar a senha
        const hashedPassword = await bcrypt.hash(createUserPARAMS.password, 10)
        // inserir o usuário no banco de dados
        const user = {
            ...createUserPARAMS,
            id: userId,
            password: hashedPassword,
        }

        // chamar o repositório
        const postgresCreateUserRepository = new PostgresCreateUserRepository()

        const createdUser = await postgresCreateUserRepository.execute(user)

        return createdUser
    }
}
