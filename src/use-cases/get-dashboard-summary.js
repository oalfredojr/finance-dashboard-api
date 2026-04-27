import { PostgresGetDashboardSummaryRepository } from '../repositories/postgres/get-dashboard-summary.js'

export class GetDashboardSummaryUseCase {
    async execute(userId, filters = {}) {
        const postgresGetDashboardSummaryRepository =
            new PostgresGetDashboardSummaryRepository()
        const summary = await postgresGetDashboardSummaryRepository.execute(
            userId,
            filters,
        )

        return summary
    }
}
