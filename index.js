import 'dotenv/config.js'
import express from 'express'
import usersRouter from './src/routes/users.js'

const app = express()

app.use(express.json())

// mount user router
app.use('/api/users', usersRouter)

app.listen(process.env.PORT, () =>
    console.log(`Listening on port ${process.env.PORT}`),
)
