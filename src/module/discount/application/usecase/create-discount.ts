import { IDiscountRepository } from '../../domain/interface';
import { CreateDiscountDTO, DiscountDetailDTO } from '../dtos';
import { DiscountCode } from '../../domain/domain';

export class CreateDiscountUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(dto: CreateDiscountDTO): Promise<DiscountDetailDTO> {
    DiscountCode.create({
      name: dto.name,
      discountCode: dto.discountCode,
      type: dto.type,
      discountValue: dto.discountValue,
      minimumOrderValue: dto.minimumOrderValue,
      maximumDiscount: dto.maximumDiscount,
      maximumUsage: dto.maximumUsage,
      startTime: dto.startTime,
      endTime: dto.endTime,
      isActive: dto.isActive,
      allowSaveBefore: dto.allowSaveBefore,
    });

    return this.discountRepository.createDiscount(dto);
  }
}
