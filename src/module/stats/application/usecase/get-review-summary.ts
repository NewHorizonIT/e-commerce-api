import { injectable, inject } from 'tsyringe';
import type { RatingSummaryDTO, StatsRangeQueryDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetReviewSummaryUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<RatingSummaryDTO> {
    return this.statsRepository.getReviewSummary(query);
  }
}
