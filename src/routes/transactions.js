import express from 'express'
import { CreateTransactionController } from '../controllers/create-transaction.js'
import { GetTransactionsController } from '../controllers/get-transactions.js'
import { UpdateTransactionController } from '../controllers/update-transaction.js'
import { DeleteTransactionController } from '../controllers/delete-transaction.js'
import { GetDashboardSummaryController } from '../controllers/get-dashboard-summary.js'

const router = express.Router()

// Transaction CRUD routes
router.post('/', async (req, res) => {
    const controller = new CreateTransactionController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

router.get('/user/:userId', async (req, res) => {
    const controller = new GetTransactionsController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

router.patch('/:transactionId', async (req, res) => {
    const controller = new UpdateTransactionController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

router.delete('/:transactionId', async (req, res) => {
    const controller = new DeleteTransactionController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

// Dashboard routes
router.get('/dashboard/:userId', async (req, res) => {
    const controller = new GetDashboardSummaryController()
    const { statusCode, body } = await controller.execute(req)
    res.status(statusCode).json(body)
})

export default router
