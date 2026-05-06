export const STATS_TOKENS = {
  IStatsRepository: Symbol.for('IStatsRepository'),
  IStatsModulePort: Symbol.for('IStatsModulePort'),
  getOverview: Symbol.for('StatsGetOverviewUseCase'),
  getOrdersTrend: Symbol.for('StatsGetOrdersTrendUseCase'),
  getOrdersStatusBreakdown: Symbol.for('StatsGetOrdersStatusBreakdownUseCase'),
  getOrdersRevenueByStatus: Symbol.for('StatsGetOrdersRevenueByStatusUseCase'),
  getTopSellingProducts: Symbol.for('StatsGetTopSellingProductsUseCase'),
  getTopSpenders: Symbol.for('StatsGetTopSpendersUseCase'),
  getReviewSummary: Symbol.for('StatsGetReviewSummaryUseCase'),
} as const;
