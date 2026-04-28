import { ProductName } from './value_objects';

export class Product {
  private constructor(
    private readonly id: number | null,
    private name: ProductName,
    private description: string | null,
    private totalSold: number,
    private hasVariant: boolean,
    private isHidden: boolean,
    private categoryId: number,
    private productTypeId: number
  ) {}

  static create(params: {
    name: ProductName;
    description?: string;
    totalSold?: number;
    hasVariant?: boolean;
    isHidden?: boolean;
    categoryId: number;
    productTypeId: number;
  }): Product {
    return new Product(
      null,
      params.name,
      params.description?.trim() || null,
      params.totalSold ?? 0,
      params.hasVariant ?? true,
      params.isHidden ?? true,
      params.categoryId,
      params.productTypeId
    );
  }

  static rehydrate(params: {
    id: number;
    name: ProductName;
    description: string | null;
    totalSold: number;
    hasVariant: boolean;
    isHidden: boolean;
    categoryId: number;
    productTypeId: number;
  }): Product {
    return new Product(
      params.id,
      params.name,
      params.description,
      params.totalSold,
      params.hasVariant,
      params.isHidden,
      params.categoryId,
      params.productTypeId
    );
  }

  getId(): number | null {
    return this.id;
  }

  getName(): ProductName {
    return this.name;
  }

  getDescription(): string | null {
    return this.description;
  }

  getTotalSold(): number {
    return this.totalSold;
  }

  getHasVariant(): boolean {
    return this.hasVariant;
  }

  getIsHidden(): boolean {
    return this.isHidden;
  }

  getCategoryId(): number {
    return this.categoryId;
  }

  getProductTypeId(): number {
    return this.productTypeId;
  }
}
