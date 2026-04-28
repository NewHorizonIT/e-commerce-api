import {
  CreateDiscountDTO,
  DiscountDetailDTO,
  DiscountListQueryDTO,
  PaginatedDiscountsDTO,
  UpdateDiscountDTO,
  CheckDiscountValidityDTO,
  DiscountCalculationResultDTO,
} from './application/dtos';
import { IDiscountModulePort } from './application/module_port';
import { ListDiscountsUseCase } from './application/usecase/list-discounts';
import { FindDiscountByIdUseCase } from './application/usecase/find-discount-by-id';
import { FindDiscountByCodeUseCase } from './application/usecase/find-discount-by-code';
import { CreateDiscountUseCase } from './application/usecase/create-discount';
import { UpdateDiscountUseCase } from './application/usecase/update-discount';
import { UpdateActiveDiscountUseCase } from './application/usecase/update-active-discount';
import { CheckDiscountValidityUseCase } from './application/usecase/check-discount-validity';

type DiscountUseCases = {
  listDiscounts: ListDiscountsUseCase;
  findDiscountById: FindDiscountByIdUseCase;
  findDiscountByCode: FindDiscountByCodeUseCase;
  createDiscount: CreateDiscountUseCase;
  updateDiscount: UpdateDiscountUseCase;
  updateActiveDiscount: UpdateActiveDiscountUseCase;
  checkDiscountValidity: CheckDiscountValidityUseCase;
};

export class DiscountModuleAdapter implements IDiscountModulePort {
  constructor(private readonly useCases: DiscountUseCases) {}

  listDiscounts(query: DiscountListQueryDTO): Promise<PaginatedDiscountsDTO> {
    return this.useCases.listDiscounts.execute(query);
  }

  findDiscountById(discountId: number): Promise<DiscountDetailDTO> {
    return this.useCases.findDiscountById.execute(discountId);
  }

  findDiscountByCode(code: string): Promise<DiscountDetailDTO> {
    return this.useCases.findDiscountByCode.execute(code);
  }

  createDiscount(dto: CreateDiscountDTO): Promise<DiscountDetailDTO> {
    return this.useCases.createDiscount.execute(dto);
  }

  updateDiscount(discountId: number, dto: UpdateDiscountDTO): Promise<DiscountDetailDTO> {
    return this.useCases.updateDiscount.execute(discountId, dto);
  }

  updateActiveDiscount(discountId: number, isActive: boolean): Promise<DiscountDetailDTO> {
    return this.useCases.updateActiveDiscount.execute(discountId, isActive);
  }

  checkDiscountValidity(params: CheckDiscountValidityDTO): Promise<DiscountCalculationResultDTO> {
    return this.useCases.checkDiscountValidity.execute(params);
  }
}
