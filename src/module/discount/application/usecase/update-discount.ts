import { IDiscountRepository } from '../../domain/interface';
import { UpdateDiscountDTO, DiscountDetailDTO } from '../dtos';
import { DiscountNotFoundError } from '../../domain/errors';
import { DiscountCode } from '../../domain/domain';

export class UpdateDiscountUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(discountId: number, dto: UpdateDiscountDTO): Promise<DiscountDetailDTO> {
    const existing = await this.discountRepository.findDiscountById(discountId);
    if (!existing) {
      throw new DiscountNotFoundError();
    }

    DiscountCode.create({
      id: discountId,
      name: dto.name ?? existing.name,
      discountCode: dto.discountCode ?? existing.discountCode,
      type: dto.type ?? existing.type,
      discountValue: dto.discountValue ?? existing.discountValue,
      minimumOrderValue: dto.minimumOrderValue ?? existing.minimumOrderValue,
      maximumDiscount: dto.maximumDiscount ?? existing.maximumDiscount,
      maximumUsage: dto.maximumUsage ?? existing.maximumUsage,
      startTime: new Date(dto.startTime ?? existing.startTime),
      endTime: new Date(dto.endTime ?? existing.endTime),
      isActive: existing.isActive,
      allowSaveBefore: dto.allowSaveBefore ?? existing.allowSaveBefore,
    });

    const result = await this.discountRepository.updateDiscount(discountId, dto);
    if (!result) {
      throw new DiscountNotFoundError();
    }

    return result;
  }
}
