import bcrypt from 'bcryptjs'
import { PostgresUpdateUserRepository } from '../repositories/update-user.js'
import { PostgresGetUserByIdRepository } from '../repositories/postgres/get-user-by-id.js'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'
import { EmailALreadyExistsError } from '../errors/user.js'

export class UpdateUserCase {
    async execute(userId, updateUserParams) {
        // Check if user exists
        const postgresGetUserByIdRepository =
            new PostgresGetUserByIdRepository()
        const user = await postgresGetUserByIdRepository.execute(userId)

        if (!user) {
            throw new Error('User not found')
        }

        // If updating email, check if it's already taken by another user
        if (updateUserParams.email) {
            const postgresGetUserByEmailRepository =
                new PostgresGetUserByEmailRepository()
            const userWithEmail =
                await postgresGetUserByEmailRepository.execute(
                    updateUserParams.email,
                )
            if (userWithEmail && userWithEmail.id !== userId) {
                throw new EmailALreadyExistsError(updateUserParams.email)
            }
        }

        // If updating password, hash it
        let paramsToUpdate = { ...updateUserParams }
        if (updateUserParams.password) {
            paramsToUpdate.password = await bcrypt.hash(
                updateUserParams.password,
                10,
            )
        }

        // Update the user
        const postgresUpdateUserRepository = new PostgresUpdateUserRepository()
        const updatedUser = await postgresUpdateUserRepository.execute(
            userId,
            paramsToUpdate,
        )

        return updatedUser
    }
}
