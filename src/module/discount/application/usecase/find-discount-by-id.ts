import { IDiscountRepository } from '../../domain/interface';
import { DiscountDetailDTO } from '../dtos';
import { DiscountNotFoundError } from '../../domain/errors';

export class FindDiscountByIdUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(discountId: number): Promise<DiscountDetailDTO> {
    const discount = await this.discountRepository.findDiscountById(discountId);
    if (!discount) {
      throw new DiscountNotFoundError();
    }

    return discount;
  }
}
