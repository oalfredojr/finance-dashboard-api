import pg from 'pg'
import dotenv from 'dotenv'

dotenv.config()

const { Pool } = pg

const requiredEnvVars = [
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_PORT',
    'POSTGRES_DB',
    'POSTGRES_HOST',
]

for (const envVar of requiredEnvVars) {
    if (
        process.env.NODE_ENV === 'production' &&
        (!process.env[envVar] || process.env[envVar].includes('change_me'))
    ) {
        throw new Error(`Missing or insecure DB env: ${envVar}`)
    }
}

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

// unified helper class used throughout the repo
export class PostgresHelper {
    static async query(text, params) {
        const client = await pool.connect()
        try {
            const res = await client.query(text, params)
            return res.rows
        } finally {
            client.release()
        }
    }
}

// export pool for migration scripts or low-level access
export { pool }
