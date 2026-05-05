import { injectable, inject } from 'tsyringe';
import type { StatsRangeQueryDTO, TopSpenderDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetTopSpendersUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<TopSpenderDTO[]> {
    return this.statsRepository.getTopSpenders(query);
  }
}
