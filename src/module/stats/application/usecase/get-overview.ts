import { injectable, inject } from 'tsyringe';
import type { StatsOverviewDTO, StatsRangeQueryDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetOverviewUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<StatsOverviewDTO> {
    return this.statsRepository.getOverview(query);
  }
}
