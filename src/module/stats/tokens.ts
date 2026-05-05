export const STATS_TOKENS = {
  IStatsRepository: Symbol.for('IStatsRepository'),
  IStatsModulePort: Symbol.for('IStatsModulePort'),
  getOverview: Symbol.for('StatsGetOverviewUseCase'),
  getOrdersTrend: Symbol.for('StatsGetOrdersTrendUseCase'),
  getOrdersStatusBreakdown: Symbol.for('StatsGetOrdersStatusBreakdownUseCase'),
  getTopSellingProducts: Symbol.for('StatsGetTopSellingProductsUseCase'),
  getTopSpenders: Symbol.for('StatsGetTopSpendersUseCase'),
  getReviewSummary: Symbol.for('StatsGetReviewSummaryUseCase'),
} as const;
