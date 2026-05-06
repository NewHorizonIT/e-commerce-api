import { type DependencyContainer } from 'tsyringe';
import { STATS_TOKENS } from './tokens';
import { TypeORMStatsRepository } from './infrastructure/repository';
import { StatsModuleAdapter } from './module_adapter';
import { StatsController } from './presentation/controller';
import { GetOverviewUseCase } from './application/usecase/get-overview';
import { GetOrdersTrendUseCase } from './application/usecase/get-orders-trend';
import { GetOrdersStatusBreakdownUseCase } from './application/usecase/get-orders-status-breakdown';
import { GetOrdersRevenueByStatusUseCase } from './application/usecase/get-orders-revenue-by-status';
import { GetTopSellingProductsUseCase } from './application/usecase/get-top-selling-products';
import { GetTopSpendersUseCase } from './application/usecase/get-top-spenders';
import { GetReviewSummaryUseCase } from './application/usecase/get-review-summary';

export function registerStatsDependencies(container: DependencyContainer): void {
  container.registerSingleton(STATS_TOKENS.IStatsRepository, TypeORMStatsRepository);
  container.registerSingleton(STATS_TOKENS.getOverview, GetOverviewUseCase);
  container.registerSingleton(STATS_TOKENS.getOrdersTrend, GetOrdersTrendUseCase);
  container.registerSingleton(
    STATS_TOKENS.getOrdersStatusBreakdown,
    GetOrdersStatusBreakdownUseCase
  );
  container.registerSingleton(STATS_TOKENS.getOrdersRevenueByStatus, GetOrdersRevenueByStatusUseCase);
  container.registerSingleton(STATS_TOKENS.getTopSellingProducts, GetTopSellingProductsUseCase);
  container.registerSingleton(STATS_TOKENS.getTopSpenders, GetTopSpendersUseCase);
  container.registerSingleton(STATS_TOKENS.getReviewSummary, GetReviewSummaryUseCase);
  container.registerSingleton(STATS_TOKENS.IStatsModulePort, StatsModuleAdapter);
  container.registerSingleton(StatsController);
}
