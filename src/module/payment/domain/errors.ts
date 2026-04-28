import { BadRequestError } from '@/shared/error/error';

export class InvalidPaymentGatewayError extends BadRequestError {
  constructor() {
    super('Invalid payment gateway. Must be "vnpay", "momo", or "zalopay"');
  }
}

export class InvalidPaymentStatusError extends BadRequestError {
  constructor() {
    super('Invalid payment status');
  }
}

export class InvalidPaymentMethodError extends BadRequestError {
  constructor() {
    super('Invalid payment method. Must be "card", "wallet", or "bank_transfer"');
  }
}

export class InvalidPaymentAmountError extends BadRequestError {
  constructor() {
    super('Invalid payment amount. Must be positive integer');
  }
}

export class MissingOrderIdError extends BadRequestError {
  constructor() {
    super('Order ID is required');
  }
}

export class MissingTransactionReferenceError extends BadRequestError {
  constructor() {
    super('Transaction reference is required');
  }
}

export class PaymentInitiationFailedError extends BadRequestError {
  constructor(gateway: string, message?: string) {
    super(`Failed to initiate payment with ${gateway}. ${message || ''}`);
  }
}

export class PaymentCallbackValidationError extends BadRequestError {
  constructor(gateway: string) {
    super(`Invalid callback signature from ${gateway}`);
  }
}

export class PaymentStatusCheckFailedError extends BadRequestError {
  constructor(gateway: string) {
    super(`Failed to check payment status from ${gateway}`);
  }
}

export class TransactionNotFoundError extends BadRequestError {
  constructor(reference: string) {
    super(`Transaction not found: ${reference}`);
  }
}

export class InvalidCallbackDataError extends BadRequestError {
  constructor(message?: string) {
    super(`Invalid callback data. ${message || ''}`);
  }
}
