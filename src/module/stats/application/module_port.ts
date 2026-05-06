import type {
  RatingSummaryDTO,
  StatsOverviewDTO,
  StatsRangeQueryDTO,
  StatsStatusBreakdownDTO,
  StatsTrendDTO,
  TopSellingProductDTO,
  TopSpenderDTO,
} from './dtos';

export interface IStatsModulePort {
  getOverview(query: StatsRangeQueryDTO): Promise<StatsOverviewDTO>;
  getOrdersTrend(query: StatsRangeQueryDTO): Promise<StatsTrendDTO>;
  getOrdersStatusBreakdown(query: StatsRangeQueryDTO): Promise<StatsStatusBreakdownDTO>;
  getOrdersRevenueByStatus(query: StatsRangeQueryDTO): Promise<import('./dtos').StatsRevenueByStatusDTO>;
  getTopSellingProducts(query: StatsRangeQueryDTO): Promise<TopSellingProductDTO[]>;
  getTopSpenders(query: StatsRangeQueryDTO): Promise<TopSpenderDTO[]>;
  getReviewSummary(query: StatsRangeQueryDTO): Promise<RatingSummaryDTO>;
}
