import { IDiscountRepository } from '../../domain/interface';
import { DiscountListQueryDTO, PaginatedDiscountsDTO } from '../dtos';

export class ListDiscountsUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  execute(query: DiscountListQueryDTO): Promise<PaginatedDiscountsDTO> {
    return this.discountRepository.listDiscounts(query);
  }
}
