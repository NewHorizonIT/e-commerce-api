import { DiscountType } from '../domain/value_objects';

export interface PaginationQueryDTO {
  page: number;
  limit: number;
}

export interface DiscountListQueryDTO extends PaginationQueryDTO {
  isActive?: boolean;
  sortBy?: 'name' | 'startTime' | 'discountValue';
  sortOrder?: 'asc' | 'desc';
}

export interface DiscountSummaryDTO {
  id: number;
  name: string;
  discountCode: string;
  type: DiscountType;
  discountValue: number;
  minimumOrderValue: number;
  isActive: boolean;
  startTime: string;
  endTime: string;
}

export interface DiscountDetailDTO {
  id: number;
  name: string;
  discountCode: string;
  type: DiscountType;
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount: number;
  maximumUsage: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  allowSaveBefore: boolean;
}

export interface PaginatedDiscountsDTO {
  items: DiscountDetailDTO[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateDiscountDTO {
  name: string;
  discountCode: string;
  type: DiscountType;
  discountValue: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  maximumUsage?: number;
  startTime: Date;
  endTime: Date;
  isActive?: boolean;
  allowSaveBefore?: boolean;
}

export interface UpdateDiscountDTO {
  name?: string;
  discountCode?: string;
  type?: DiscountType;
  discountValue?: number;
  minimumOrderValue?: number;
  maximumDiscount?: number;
  maximumUsage?: number;
  startTime?: Date;
  endTime?: Date;
  allowSaveBefore?: boolean;
}

export interface CheckDiscountValidityDTO {
  discountCode: string;
  orderAmount: number;
  currentDate?: Date;
}

export interface DiscountCalculationResultDTO {
  discountAmount: number;
  finalAmount: number;
  isValid: boolean;
}
