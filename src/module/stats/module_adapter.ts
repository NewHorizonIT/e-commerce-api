import { inject, injectable } from 'tsyringe';
import type {
  RatingSummaryDTO,
  StatsOverviewDTO,
  StatsRangeQueryDTO,
  StatsStatusBreakdownDTO,
  StatsTrendDTO,
  TopSellingProductDTO,
  TopSpenderDTO,
} from './application/dtos';
import type { IStatsModulePort } from './application/module_port';
import { GetOverviewUseCase } from './application/usecase/get-overview';
import { GetOrdersTrendUseCase } from './application/usecase/get-orders-trend';
import { GetOrdersStatusBreakdownUseCase } from './application/usecase/get-orders-status-breakdown';
import { GetTopSellingProductsUseCase } from './application/usecase/get-top-selling-products';
import { GetTopSpendersUseCase } from './application/usecase/get-top-spenders';
import { GetReviewSummaryUseCase } from './application/usecase/get-review-summary';
import { STATS_TOKENS } from './tokens';

@injectable()
export class StatsModuleAdapter implements IStatsModulePort {
  constructor(
    @inject(STATS_TOKENS.getOverview)
    private readonly getOverviewUseCase: GetOverviewUseCase,
    @inject(STATS_TOKENS.getOrdersTrend)
    private readonly getOrdersTrendUseCase: GetOrdersTrendUseCase,
    @inject(STATS_TOKENS.getOrdersStatusBreakdown)
    private readonly getOrdersStatusBreakdownUseCase: GetOrdersStatusBreakdownUseCase,
    @inject(STATS_TOKENS.getTopSellingProducts)
    private readonly getTopSellingProductsUseCase: GetTopSellingProductsUseCase,
    @inject(STATS_TOKENS.getTopSpenders)
    private readonly getTopSpendersUseCase: GetTopSpendersUseCase,
    @inject(STATS_TOKENS.getReviewSummary)
    private readonly getReviewSummaryUseCase: GetReviewSummaryUseCase
  ) {}

  getOverview(query: StatsRangeQueryDTO): Promise<StatsOverviewDTO> {
    return this.getOverviewUseCase.execute(query);
  }

  getOrdersTrend(query: StatsRangeQueryDTO): Promise<StatsTrendDTO> {
    return this.getOrdersTrendUseCase.execute(query);
  }

  getOrdersStatusBreakdown(query: StatsRangeQueryDTO): Promise<StatsStatusBreakdownDTO> {
    return this.getOrdersStatusBreakdownUseCase.execute(query);
  }

  getTopSellingProducts(query: StatsRangeQueryDTO): Promise<TopSellingProductDTO[]> {
    return this.getTopSellingProductsUseCase.execute(query);
  }

  getTopSpenders(query: StatsRangeQueryDTO): Promise<TopSpenderDTO[]> {
    return this.getTopSpendersUseCase.execute(query);
  }

  getReviewSummary(query: StatsRangeQueryDTO): Promise<RatingSummaryDTO> {
    return this.getReviewSummaryUseCase.execute(query);
  }
}
