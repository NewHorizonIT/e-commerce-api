import { AppError } from "@/shared/error/error";

export class InvalidQuantityError extends AppError {
  constructor() {
    super(
      'Quantity must be a non-negative integer', 
      'CART_INVALID_QUANTITY', 
      400
    );
  }
}

export class NegativeQuantityResultError extends AppError {
  constructor() {
    super(
      'Resulting quantity cannot be negative', 
      'CART_NEGATIVE_RESULT', 
      400
    );
  }
}

export class UnexpectedMissingCartIdError extends AppError {
  constructor(){
    super("Cart ID missing after save", 'MISSING_CART_ID', 500);
  }
}

export class UnexpectedMissingCartItemIdError extends AppError {
  constructor(){
    super("Cart item ID missing after save", 'MISSING_CART_ITEM_ID', 500);
  }
}