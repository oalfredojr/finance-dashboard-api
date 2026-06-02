// jest.setup.js
import 'dotenv/config.js'

// Mock do pool do PostgreSQL para testes
jest.mock('./src/db/postgres/helper.js', () => ({
    PostgresHelper: {
        query: jest.fn(),
    },
    pool: {
        connect: jest.fn(),
        end: jest.fn(),
    },
}))
