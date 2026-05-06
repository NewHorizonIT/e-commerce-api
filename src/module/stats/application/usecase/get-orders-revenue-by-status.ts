import { injectable, inject } from 'tsyringe';
import type { StatsRangeQueryDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetOrdersRevenueByStatusUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO) {
    return this.statsRepository.getOrdersRevenueByStatus(query);
  }
}
