import { injectable, inject } from 'tsyringe';
import type { StatsRangeQueryDTO, StatsStatusBreakdownDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetOrdersStatusBreakdownUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<StatsStatusBreakdownDTO> {
    return this.statsRepository.getOrdersStatusBreakdown(query);
  }
}
