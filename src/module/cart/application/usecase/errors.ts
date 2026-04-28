import { AppError } from "@/shared/error/error";

export class NotFoundCartErrorById extends AppError {
  constructor(id: number) {
    super(`Cart with ID ${id} not found`, 'NOT_FOUND_CART_BY_ID', 404);
  }
}

export class NotFoundCartItemErrorByVariantId extends AppError {
  constructor(id: number) {
    super(`Cart Item with Variant ID ${id} not found`, 'NOT_FOUND_CART_ITEM_BY_VARIANT_ID', 404);
  }
}

export class NotFoundCartItemErrorByAccountId extends AppError {
  constructor(id: number) {
    super(`Cart Item with Account ID ${id} not found`, 'NOT_FOUND_CART_ITEM_BY_ACCOUNT_ID', 404);
  }
}

