import { CreateUserController } from '../controllers/create-user.js'
import { CreateUserCase } from '../use-cases/create-user.js'
import { EmailALreadyExistsError } from '../errors/user.js'

// Mock do use case
jest.mock('../use-cases/create-user.js')

describe('CreateUserController', () => {
    let controller
    let mockCreateUserCase

    beforeEach(() => {
        mockCreateUserCase = {
            execute: jest.fn(),
        }
        CreateUserCase.mockImplementation(() => mockCreateUserCase)
        controller = new CreateUserController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 400 if first_name is missing', async () => {
        const httpRequest = {
            body: {
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Missing param: first_name')
    })

    test('should return 400 if last_name is missing', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                email: 'john@example.com',
                password: 'password123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Missing param: last_name')
    })

    test('should return 400 if email is missing', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                password: 'password123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Missing param: email')
    })

    test('should return 400 if password is missing', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Missing param: password')
    })

    test('should return 400 if password is too short', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: '123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe(
            'Password must be at least 6 characters long.',
        )
    })

    test('should return 400 if email is invalid', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'invalid-email',
                password: 'password123',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid email format.')
    })

    test('should return 409 if email already exists', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            },
        }

        mockCreateUserCase.execute.mockRejectedValue(
            new EmailALreadyExistsError('john@example.com'),
        )

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(409)
        expect(result.body.message).toBe(
            'The e-mail john@example.com is already in use.',
        )
    })

    test('should return 201 on success', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            },
        }

        const user = {
            id: 'user-id',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
        }

        mockCreateUserCase.execute.mockResolvedValue(user)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual(user)
        expect(mockCreateUserCase.execute).toHaveBeenCalledWith({
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com',
            password: 'password123',
        })
    })

    test('should return 500 on server error', async () => {
        const httpRequest = {
            body: {
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            },
        }

        mockCreateUserCase.execute.mockRejectedValue(
            new Error('Database error'),
        )

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(500)
        expect(result.body.message).toBe('Internal server error')
    })
})
