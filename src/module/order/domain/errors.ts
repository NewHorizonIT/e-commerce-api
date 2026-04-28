import { AppError } from '@/shared/error/error';

export class MissingBankTransferTransactionCodeError extends AppError {
  constructor() {
    super(
      'Bank Transfer Transaction Code is missing',
      'MISSING_BANK_TRANSFER_TRANSACTION_CODE',
      400
    );
  }
}

export class MissingPaymentMethodError extends AppError {
  constructor() {
    super('Payment Method is missing', 'MISSING_PAYMENT_METHOD', 400);
  }
}

export class InvalidPaymentMethodError extends AppError {
  constructor() {
    super('Payment Method is invalid', 'INVALID_PAYMENT_METHOD', 400);
  }
}

export class MissingAccountIdError extends AppError {
  constructor() {
    super('Account ID is missing', 'MISSING_ACCOUNT_ID', 400);
  }
}

export class InvalidAccountIdError extends AppError {
  constructor() {
    super('Account ID is invalid', 'INVALID_ACCOUNT_ID', 400);
  }
}

export class MissingShippingInfoIdError extends AppError {
  constructor() {
    super('Shipping Info ID is missing', 'MISSING_SHIPPING_INFO_ID', 400);
  }
}

export class InvalidShippingInfoIdError extends AppError {
  constructor() {
    super('Shipping Info ID is invalid', 'INVALID_SHIPPING_INFO_ID', 400);
  }
}

export class MissingDiscountCodeIdError extends AppError {
  constructor() {
    super('Discount Code ID is missing', 'MISSING_DISCOUNT_COUNT_ID', 400);
  }
}

export class InvalidDiscountCodeIdError extends AppError {
  constructor() {
    super('Discount Code ID is invalid', 'INVALID_DISCOUNT_COUNT_ID', 400);
  }
}

export class NegativeTotalAmountError extends AppError {
  constructor() {
    super('Total amount cannot be negative', 'NEGATIVE_TOTAL_AMOUNT', 400);
  }
}

export class InvalidStatusError extends AppError {
  constructor() {
    super('Status is invalid', 'INVALID_STATUS', 400);
  }
}

export class MissingOrderIdError extends AppError {
  constructor() {
    super('Order ID is missing', 'MISSING_ORDER_ID', 400);
  }
}

export class InvalidOrderIdError extends AppError {
  constructor() {
    super('Order ID is invalid', 'INVALID_ORDER_ID', 400);
  }
}

export class MissingVariantIdError extends AppError {
  constructor() {
    super('Variant ID is missing', 'MISSING_VARIANT_ID', 400);
  }
}

export class InvalidVariantIdError extends AppError {
  constructor() {
    super('Variant ID is invalid', 'INVALID_VARIANT_ID', 400);
  }
}

export class GreaterThanOrEqualZeroQuantityError extends AppError {
  constructor() {
    super(
      'Quantity must be greater than or equal zero',
      'GREATER_THAN_OR_EQUAL_ZERO_QUANTITY',
      400
    );
  }
}

export class NotFoundOrderError extends AppError {
  constructor() {
    super('Order not found', 'NOT_FOUND_ORDER', 400);
  }
}

export class FailedOrderCreationError extends AppError {
  constructor() {
    super('Order creation failed', 'FAILED_ORDER_CREATION', 400);
  }
}
