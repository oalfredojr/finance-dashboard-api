import express from 'express'
import { CreateUserController } from '../controllers/create-user.js'
import { LoginController } from '../controllers/login.js'

const router = express.Router()

// Register new user
router.post('/register', async (req, res) => {
    const controller = new CreateUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

// Login user
router.post('/login', async (req, res) => {
    const controller = new LoginController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

export default router
