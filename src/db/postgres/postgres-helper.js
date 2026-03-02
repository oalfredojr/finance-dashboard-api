import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
})

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
