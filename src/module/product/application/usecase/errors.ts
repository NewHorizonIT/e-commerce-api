import { AppError } from '@/shared/error/error';

export class ProductNotFoundError extends AppError {
  constructor(productId: number) {
    super(`Product with ID ${productId} not found`, 'PRODUCT_NOT_FOUND', 404);
  }
}

export class ProductAlreadyExistsError extends AppError {
  constructor(name: string) {
    super(`Product name ${name} already exists`, 'PRODUCT_ALREADY_EXISTS', 409);
  }
}

export class ProductHardDeleteBlockedError extends AppError {
  constructor(productId: number) {
    super(
      `Product with ID ${productId} cannot be hard deleted because it is referenced`,
      'PRODUCT_HARD_DELETE_BLOCKED',
      409
    );
  }
}

export class VariantNotFoundError extends AppError {
  constructor(variantId: number) {
    super(`Variant with ID ${variantId} not found`, 'VARIANT_NOT_FOUND', 404);
  }
}

export class VariantGroupNotFoundError extends AppError {
  constructor(groupId: number) {
    super(`Variant group with ID ${groupId} not found`, 'VARIANT_GROUP_NOT_FOUND', 404);
  }
}

export class VariantValueNotFoundError extends AppError {
  constructor(valueId: number) {
    super(`Variant value with ID ${valueId} not found`, 'VARIANT_VALUE_NOT_FOUND', 404);
  }
}

export class CategoryNotFoundError extends AppError {
  constructor(categoryId: number) {
    super(`Category with ID ${categoryId} not found`, 'CATEGORY_NOT_FOUND', 404);
  }
}

export class ProductTypeNotFoundError extends AppError {
  constructor(productTypeId: number) {
    super(`Product type with ID ${productTypeId} not found`, 'PRODUCT_TYPE_NOT_FOUND', 404);
  }
}

export class ResourceDeleteBlockedError extends AppError {
  constructor(resourceName: string) {
    super(
      `Cannot delete ${resourceName} because it is being used by products`,
      'DELETE_BLOCKED',
      409
    );
  }
}
