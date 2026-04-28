// Payment Gateway Types
export type PaymentGateway = 'vnpay' | 'momo' | 'zalopay';
export const PAYMENT_GATEWAY_VALUES = ['vnpay', 'momo', 'zalopay'] as const;

// Payment Status Types
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
export const PAYMENT_STATUS_VALUES = [
  'pending',
  'processing',
  'completed',
  'failed',
  'cancelled',
] as const;

// Payment Method Types
export type PaymentMethod = 'card' | 'wallet' | 'bank_transfer';
export const PAYMENT_METHOD_VALUES = ['card', 'wallet', 'bank_transfer'] as const;

// Gateway-specific response codes
export type VNPayResponseCode = string;
export type MomoResponseCode = string;
export type ZaloPayResponseCode = string;

/**
 * Payment Amount - must be positive integer (in smallest unit: VND for VN gateways)
 */
export class PaymentAmount {
  constructor(private readonly amount: number) {
    if (amount <= 0 || !Number.isInteger(amount)) {
      throw new Error('Payment amount must be positive integer');
    }
  }

  getValue(): number {
    return this.amount;
  }
}

/**
 * Transaction Reference ID - unique identifier for each transaction
 */
export class TransactionReference {
  private constructor(private readonly reference: string) {
    if (!reference || reference.trim().length === 0) {
      throw new Error('Transaction reference cannot be empty');
    }
  }

  static create(reference: string): TransactionReference {
    return new TransactionReference(reference);
  }

  getValue(): string {
    return this.reference;
  }
}

/**
 * Gateway Transaction ID - provided by payment gateway
 */
export class GatewayTransactionId {
  private constructor(private readonly transactionId: string) {
    if (!transactionId || transactionId.trim().length === 0) {
      throw new Error('Gateway transaction ID cannot be empty');
    }
  }

  static create(transactionId: string): GatewayTransactionId {
    return new GatewayTransactionId(transactionId);
  }

  getValue(): string {
    return this.transactionId;
  }
}
