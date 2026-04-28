import { IDiscountRepository } from '../../domain/interface';
import { DiscountDetailDTO } from '../dtos';
import { DiscountNotFoundError } from '../../domain/errors';

export class UpdateActiveDiscountUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(discountId: number, isActive: boolean): Promise<DiscountDetailDTO> {
    const existing = await this.discountRepository.findDiscountById(discountId);

    if (!existing) {
      throw new DiscountNotFoundError();
    }

    const result = await this.discountRepository.updateActiveDiscount(discountId, isActive);

    if (!result) {
      throw new DiscountNotFoundError();
    }

    return result;
  }
}
