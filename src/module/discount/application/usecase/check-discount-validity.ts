import { IDiscountRepository } from '../../domain/interface';
import { CheckDiscountValidityDTO, DiscountCalculationResultDTO } from '../dtos';
import {
  DiscountExpiredError,
  DiscountNotActiveError,
  DiscountNotStartedError,
  DiscountNotFoundError,
} from '../../domain/errors';
import { DiscountCode } from '../../domain/domain';

export class CheckDiscountValidityUseCase {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async execute(params: CheckDiscountValidityDTO): Promise<DiscountCalculationResultDTO> {
    const discount = await this.discountRepository.findDiscountByCode(params.discountCode);
    if (!discount) {
      throw new DiscountNotFoundError();
    }
    if (!discount.isActive) {
      throw new DiscountNotActiveError();
    }

    const currentDate = params.currentDate ?? new Date();
    const startDate = new Date(discount.startTime);
    const endDate = new Date(discount.endTime);
    if (currentDate < startDate) {
      throw new DiscountNotStartedError();
    }
    if (currentDate > endDate) {
      throw new DiscountExpiredError();
    }

    const discountCode = DiscountCode.create({
      id: discount.id,
      name: discount.name,
      discountCode: discount.discountCode,
      type: discount.type,
      discountValue: discount.discountValue,
      minimumOrderValue: discount.minimumOrderValue,
      maximumDiscount: discount.maximumDiscount,
      maximumUsage: discount.maximumUsage,
      startTime: startDate,
      endTime: endDate,
      isActive: discount.isActive,
      allowSaveBefore: discount.allowSaveBefore,
    });
    if (!discountCode.isValidForOrderAmount(params.orderAmount)) {
      return {
        discountAmount: 0,
        finalAmount: params.orderAmount,
        isValid: false,
      };
    }

    const discountAmount = discountCode.calculateDiscount(params.orderAmount);

    return {
      discountAmount,
      finalAmount: Math.max(0, params.orderAmount - discountAmount),
      isValid: true,
    };
  }
}
