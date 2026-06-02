import { GetDashboardSummaryController } from '../controllers/get-dashboard-summary.js'
import { GetDashboardSummaryUseCase } from '../use-cases/get-dashboard-summary.js'

// Mock do use case
jest.mock('../use-cases/get-dashboard-summary.js')

describe('GetDashboardSummaryController', () => {
    let controller
    let mockUseCase

    beforeEach(() => {
        mockUseCase = {
            execute: jest.fn(),
        }
        GetDashboardSummaryUseCase.mockImplementation(() => mockUseCase)
        controller = new GetDashboardSummaryController()
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('should return 403 if user tries to access another user dashboard', async () => {
        const httpRequest = {
            params: {
                userId: '550e8400-e29b-41d4-a716-446655440000',
            },
            query: {},
            user: {
                id: '550e8400-e29b-41d4-a716-446655440001',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(403)
        expect(result.body.message).toBe(
            'Forbidden: You can only access your own dashboard',
        )
    })

    test('should return 400 if userId is invalid', async () => {
        const httpRequest = {
            params: {
                userId: 'invalid-id',
            },
            query: {},
            user: {
                id: 'invalid-id',
            },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid userId format')
    })

    test('should return 400 if invalid month/year filter', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: { month: '13', year: '2024' },
            user: { id: userId },
        }

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(400)
        expect(result.body.message).toBe('Invalid month/year filter')
    })

    test('should return 200 with dashboard summary on success', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: {},
            user: { id: userId },
        }

        const summary = {
            total_earnings: 5000,
            total_expenses: 2000,
            total_investments: 1000,
            net_balance: 2000,
        }

        mockUseCase.execute.mockResolvedValue(summary)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(summary)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId, {})
    })

    test('should return 200 with filtered dashboard summary', async () => {
        const userId = '550e8400-e29b-41d4-a716-446655440000'
        const httpRequest = {
            params: { userId },
            query: { month: '1', year: '2024' },
            user: { id: userId },
        }

        const summary = {
            total_earnings: 500,
            total_expenses: 200,
            total_investments: 100,
            net_balance: 200,
        }

        mockUseCase.execute.mockResolvedValue(summary)

        const result = await controller.execute(httpRequest)

        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(summary)
        expect(mockUseCase.execute).toHaveBeenCalledWith(userId, {
            month: 1,
            year: 2024,
        })
    })
})
