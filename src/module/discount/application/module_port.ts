import {
  CreateDiscountDTO,
  DiscountCalculationResultDTO,
  DiscountDetailDTO,
  DiscountListQueryDTO,
  PaginatedDiscountsDTO,
  UpdateDiscountDTO,
  CheckDiscountValidityDTO,
} from './dtos';

export interface IDiscountModulePort {
  listDiscounts(query: DiscountListQueryDTO): Promise<PaginatedDiscountsDTO>;
  findDiscountById(discountId: number): Promise<DiscountDetailDTO>;
  findDiscountByCode(discountCode: string): Promise<DiscountDetailDTO>;

  createDiscount(dto: CreateDiscountDTO): Promise<DiscountDetailDTO>;
  updateDiscount(discountId: number, dto: UpdateDiscountDTO): Promise<DiscountDetailDTO>;
  updateActiveDiscount(discountId: number, isActive: boolean): Promise<DiscountDetailDTO>;
  checkDiscountValidity(params: CheckDiscountValidityDTO): Promise<DiscountCalculationResultDTO>;
}
