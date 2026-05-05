import { injectable, inject } from 'tsyringe';
import type { StatsRangeQueryDTO, TopSellingProductDTO } from '../dtos';
import type { IStatsRepository } from '../../domain/interface';
import { STATS_TOKENS } from '../../tokens';

@injectable()
export class GetTopSellingProductsUseCase {
  constructor(
    @inject(STATS_TOKENS.IStatsRepository)
    private readonly statsRepository: IStatsRepository
  ) {}

  execute(query: StatsRangeQueryDTO): Promise<TopSellingProductDTO[]> {
    return this.statsRepository.getTopSellingProducts(query);
  }
}
