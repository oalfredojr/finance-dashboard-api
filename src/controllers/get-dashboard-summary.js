import { GetDashboardSummaryUseCase } from '../use-cases/get-dashboard-summary.js'
import { badRequest, ok, serverError } from '../helpers/http-helper.js'
import validator from 'validator'

export class GetDashboardSummaryController {
    async execute(httpRequest) {
        try {
            const { userId } = httpRequest.params
            const { month, year } = httpRequest.query

            // Validate userId
            if (!validator.isUUID(userId)) {
                return badRequest({ message: 'Invalid userId format' })
            }

            // Validate filters
            const filters = {}

            if (month && year) {
                const monthNum = parseInt(month)
                const yearNum = parseInt(year)
                if (
                    monthNum < 1 ||
                    monthNum > 12 ||
                    yearNum < 2000 ||
                    yearNum > 2100
                ) {
                    return badRequest({ message: 'Invalid month/year filter' })
                }
                filters.month = monthNum
                filters.year = yearNum
            }

            const getDashboardSummaryUseCase = new GetDashboardSummaryUseCase()
            const summary = await getDashboardSummaryUseCase.execute(
                userId,
                filters,
            )

            return ok(summary)
        } catch (error) {
            console.error(error)
            return serverError()
        }
    }
}
