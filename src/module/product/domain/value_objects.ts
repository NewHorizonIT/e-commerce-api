import { BadRequestError } from '@/shared/error/error';

export class ProductName {
  public readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (!normalized) {
      throw new BadRequestError('Product name is required');
    }

    if (normalized.length > 255) {
      throw new BadRequestError('Product name must be less than or equal to 255 characters');
    }

    this.value = normalized;
  }
}

export class MoneyValue {
  public readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value < 0) {
      throw new BadRequestError('Price must be a non-negative number');
    }

    this.value = value;
  }
}

export class StockQuantity {
  public readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new BadRequestError('Stock quantity must be a non-negative integer');
    }

    this.value = value;
  }
}
