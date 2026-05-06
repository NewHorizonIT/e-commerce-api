import type {
  RatingSummaryDTO,
  StatsOverviewDTO,
  StatsRangeQueryDTO,
  StatsStatusBreakdownDTO,
  StatsTrendDTO,
  TopSellingProductDTO,
  TopSpenderDTO,
} from '../application/dtos';

export interface IStatsRepository {
  getOverview(query: StatsRangeQueryDTO): Promise<StatsOverviewDTO>;
  getOrdersTrend(query: StatsRangeQueryDTO): Promise<StatsTrendDTO>;
  getOrdersStatusBreakdown(query: StatsRangeQueryDTO): Promise<StatsStatusBreakdownDTO>;
  getOrdersRevenueByStatus(query: StatsRangeQueryDTO): Promise<import('../application/dtos').StatsRevenueByStatusDTO>;
  getTopSellingProducts(query: StatsRangeQueryDTO): Promise<TopSellingProductDTO[]>;
  getTopSpenders(query: StatsRangeQueryDTO): Promise<TopSpenderDTO[]>;
  getReviewSummary(query: StatsRangeQueryDTO): Promise<RatingSummaryDTO>;
}
