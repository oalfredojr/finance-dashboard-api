import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcryptjs'

import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js'

export class CreateUserCase {
    async execute(createUserPARAMS) {
        // TODO: verificar se o e-mail já esta em uso

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
