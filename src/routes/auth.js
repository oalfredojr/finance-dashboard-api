import express from 'express'
import { CreateUserController } from '../controllers/create-user.js'
import { LoginController } from '../controllers/login.js'
import { authLimiter } from '../middlewares/rate-limit.js'

const router = express.Router()

// Register new user (with rate limiting to prevent spam)
router.post('/register', authLimiter, async (req, res) => {
    const controller = new CreateUserController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

// Login user (with strict rate limiting to prevent brute force)
router.post('/login', authLimiter, async (req, res) => {
    const controller = new LoginController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

export default router
