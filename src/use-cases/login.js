import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js'

export class LoginUseCase {
    async execute(loginParams) {
        // Validate required fields
        const requiredFields = ['email', 'password']
        for (const field of requiredFields) {
            if (!loginParams[field] || loginParams[field].trim().length === 0) {
                throw new Error(`Missing required field: ${field}`)
            }
        }

        // Find user by email
        const postgresGetUserByEmailRepository =
            new PostgresGetUserByEmailRepository()
        const user = await postgresGetUserByEmailRepository.execute(
            loginParams.email,
        )

        if (!user) {
            throw new Error('Invalid credentials')
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(
            loginParams.password,
            user.password,
        )
        if (!passwordMatch) {
            throw new Error('Invalid credentials')
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
        )

        return {
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
            },
            token,
        }
    }
}
