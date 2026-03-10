import express from 'express'
import { CreateUserController } from '../controllers/create-user.js'
import { GetUserByIdController } from '../controllers/get-user-by-id.js'
import { UpdateUserController } from '../controllers/update-user.js'

const router = express.Router()

router.post('/', async (req, res) => {
    const controller = new CreateUserController()
    const { statusCode, body } = await controller.execute(req)

    res.status(statusCode).json(body)
})

router.get('/:userId', async (req, res) => {
    const controller = new GetUserByIdController()
    const { statusCode, body } = await controller.execute(req)

    res.status(statusCode).send(body)
})

router.patch('/:userId', async (req, res) => {
    const controller = new UpdateUserController()
    const { statusCode, body } = await controller.execute(req)

    res.status(statusCode).json(body)
})

export default router
