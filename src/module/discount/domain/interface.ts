import {
  CreateDiscountDTO,
  DiscountDetailDTO,
  DiscountListQueryDTO,
  PaginatedDiscountsDTO,
  UpdateDiscountDTO,
} from '../application/dtos';

export interface IDiscountRepository {
  listDiscounts(query: DiscountListQueryDTO): Promise<PaginatedDiscountsDTO>;
  findDiscountById(discountId: number): Promise<DiscountDetailDTO | null>;
  findDiscountByCode(code: string): Promise<DiscountDetailDTO | null>;

  createDiscount(dto: CreateDiscountDTO): Promise<DiscountDetailDTO>;
  updateDiscount(discountId: number, dto: UpdateDiscountDTO): Promise<DiscountDetailDTO | null>;
  updateActiveDiscount(discountId: number, isActive: boolean): Promise<DiscountDetailDTO | null>;
}
