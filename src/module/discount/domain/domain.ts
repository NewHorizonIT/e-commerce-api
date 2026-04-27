import { DiscountType, DISCOUNT_TYPE_VALUE } from './value_objects';
import {
  InvalidDiscountCodeError,
  InvalidDiscountNameError,
  InvalidDiscountTypeError,
  InvalidDiscountValueError,
  InvalidMaximumDiscountError,
  InvalidMaximumUsageError,
  InvalidMinimumOrderValueError,
  InvalidTimeRangeError,
} from './errors';

export class DiscountCode {
  private constructor(
    private readonly id: number | null,
    private name: string,
    private discountCode: string,
    private type: DiscountType,
    private discountValue: number,
    private minimumOrderValue: number,
    private maximumDiscount: number,
    private maximumUsage: number,
    private startTime: Date,
    private endTime: Date,
    private isActive: boolean,
    private allowSaveBefore: boolean
  ) {}

  static create(params: {
    id?: number | null;
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
  }): DiscountCode {
    if (!params.name || params.name.trim().length === 0) {
      throw new InvalidDiscountNameError();
    }

    if (!params.discountCode || params.discountCode.trim().length === 0) {
      throw new InvalidDiscountCodeError();
    }

    if (!Object.values(DISCOUNT_TYPE_VALUE).includes(params.type)) {
      throw new InvalidDiscountTypeError();
    }

    if (params.discountValue < 0) {
      throw new InvalidDiscountValueError();
    }

    if (params.minimumOrderValue !== undefined && params.minimumOrderValue < 0) {
      throw new InvalidMinimumOrderValueError();
    }

    if (params.maximumDiscount !== undefined && params.maximumDiscount <= 0) {
      throw new InvalidMaximumDiscountError();
    }

    if (params.maximumUsage !== undefined && params.maximumUsage <= 0) {
      throw new InvalidMaximumUsageError();
    }

    if (params.startTime >= params.endTime) {
      throw new InvalidTimeRangeError();
    }

    return new DiscountCode(
      params.id ?? null,
      params.name,
      params.discountCode,
      params.type,
      params.discountValue,
      params.minimumOrderValue ?? 0,
      params.maximumDiscount ?? Number.MAX_SAFE_INTEGER,
      params.maximumUsage ?? Number.MAX_SAFE_INTEGER,
      params.startTime,
      params.endTime,
      params.isActive ?? true,
      params.allowSaveBefore ?? true
    );
  }

  static rehydrate(params: {
    id: number;
    name: string;
    discountCode: string;
    type: DiscountType;
    discountValue: number;
    minimumOrderValue: number;
    maximumDiscount: number;
    maximumUsage: number;
    startTime: Date;
    endTime: Date;
    isActive: boolean;
    allowSaveBefore: boolean;
  }): DiscountCode {
    return new DiscountCode(
      params.id,
      params.name,
      params.discountCode,
      params.type,
      params.discountValue,
      params.minimumOrderValue,
      params.maximumDiscount,
      params.maximumUsage,
      params.startTime,
      params.endTime,
      params.isActive,
      params.allowSaveBefore
    );
  }

  isValidForDate(date: Date): boolean {
    return date >= this.startTime && date <= this.endTime;
  }

  isValidForOrderAmount(amount: number): boolean {
    return amount >= this.minimumOrderValue;
  }

  calculateDiscount(orderAmount: number): number {
    if (!this.isValidForOrderAmount(orderAmount)) {
      return 0;
    }

    let discount = 0;
    if (this.type === DISCOUNT_TYPE_VALUE.FIXED) {
      discount = this.discountValue;
    } else if (this.type === DISCOUNT_TYPE_VALUE.PERCENTAGE) {
      discount = (1.0 * (orderAmount * this.discountValue)) / 100;
    }

    return Math.min(discount, this.maximumDiscount);
  }

  getId(): number | null {
    return this.id;
  }

  getName(): string {
    return this.name;
  }

  getDiscountCode(): string {
    return this.discountCode;
  }

  getType(): DiscountType {
    return this.type;
  }

  getDiscountValue(): number {
    return this.discountValue;
  }

  getMinimumOrderValue(): number {
    return this.minimumOrderValue;
  }

  getMaximumDiscount(): number {
    return this.maximumDiscount;
  }

  getMaximumUsage(): number {
    return this.maximumUsage;
  }

  getStartTime(): Date {
    return this.startTime;
  }

  getEndTime(): Date {
    return this.endTime;
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getAllowSaveBefore(): boolean {
    return this.allowSaveBefore;
  }
}
