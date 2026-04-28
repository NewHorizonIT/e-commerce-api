import { IDiscountRepository } from '../../domain/interface';
import { DiscountDetailDTO } from '../dtos';
import { DiscountNotFoundError } from '../../domain/errors';

export class FindDiscountByCodeUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(code: string): Promise<DiscountDetailDTO> {
    const discount = await this.discountRepository.findDiscountByCode(code);
    if (!discount) {
      throw new DiscountNotFoundError();
    }

    return discount;
  }
}
