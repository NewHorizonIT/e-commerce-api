import { injectable, inject } from 'tsyringe';
import type { StatsRangeQueryDTO, StatsTrendDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetOrdersTrendUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<StatsTrendDTO> {
    return this.statsRepository.getOrdersTrend(query);
  }
}
