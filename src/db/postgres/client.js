import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
    user: 'root',
    password: 'password',
    port: 5432,
    database: 'financeapp',
})
