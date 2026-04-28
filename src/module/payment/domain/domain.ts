import {
  PaymentGateway,
  PaymentStatus,
  PaymentMethod,
  PaymentAmount,
  TransactionReference,
  GatewayTransactionId,
} from './value_objects';

/**
 * Payment Request - domain entity representing a payment request
 */
export class PaymentRequest {
  private constructor(
    private readonly id: number | null,
    private readonly orderId: number,
    private readonly accountId: number,
    private readonly gateway: PaymentGateway,
    private readonly method: PaymentMethod,
    private readonly amount: PaymentAmount,
    private readonly transactionRef: TransactionReference,
    private status: PaymentStatus,
    private readonly createdAt: Date,
    private updatedAt: Date,
    private successUrl: string,
    private cancelUrl: string
  ) {}

  static create(params: {
    id?: number | null;
    orderId: number;
    accountId: number;
    gateway: PaymentGateway;
    method: PaymentMethod;
    amount: number;
    transactionRef: string;
    status?: PaymentStatus;
    createdAt?: Date;
    updatedAt?: Date;
    successUrl?: string;
    cancelUrl?: string;
  }): PaymentRequest {
    const amount = new PaymentAmount(params.amount);
    const transactionRef = TransactionReference.create(params.transactionRef);

    return new PaymentRequest(
      params.id ?? null,
      params.orderId,
      params.accountId,
      params.gateway,
      params.method,
      amount,
      transactionRef,
      params.status ?? 'pending',
      params.createdAt ?? new Date(),
      params.updatedAt ?? new Date(),
      params.successUrl ?? '',
      params.cancelUrl ?? ''
    );
  }

  getId(): number | null {
    return this.id;
  }

  getOrderId(): number {
    return this.orderId;
  }

  getAccountId(): number {
    return this.accountId;
  }

  getGateway(): PaymentGateway {
    return this.gateway;
  }

  getMethod(): PaymentMethod {
    return this.method;
  }

  getAmount(): number {
    return this.amount.getValue();
  }

  getTransactionRef(): string {
    return this.transactionRef.getValue();
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  getSuccessUrl(): string {
    return this.successUrl;
  }

  getCancelUrl(): string {
    return this.cancelUrl;
  }

  setSuccessUrl(url: string): void {
    this.successUrl = url;
  }

  setCancelUrl(url: string): void {
    this.cancelUrl = url;
  }

  setStatus(status: PaymentStatus): void {
    this.status = status;
    this.updatedAt = new Date();
  }
}

/**
 * Payment Response - domain entity representing payment response from gateway
 */
export class PaymentResponse {
  private constructor(
    private readonly paymentUrl: string,
    private readonly gateway: PaymentGateway,
    private readonly gatewayTransactionId: GatewayTransactionId,
    private readonly transactionRef: TransactionReference,
    private readonly metadata: Record<string, unknown>
  ) {}

  static create(params: {
    paymentUrl: string;
    gateway: PaymentGateway;
    gatewayTransactionId: string;
    transactionRef: string;
    metadata?: Record<string, unknown>;
  }): PaymentResponse {
    const gatewayTransactionId = GatewayTransactionId.create(params.gatewayTransactionId);
    const transactionRef = TransactionReference.create(params.transactionRef);

    return new PaymentResponse(
      params.paymentUrl,
      params.gateway,
      gatewayTransactionId,
      transactionRef,
      params.metadata ?? {}
    );
  }

  getPaymentUrl(): string {
    return this.paymentUrl;
  }

  getGateway(): PaymentGateway {
    return this.gateway;
  }

  getGatewayTransactionId(): string {
    return this.gatewayTransactionId.getValue();
  }

  getTransactionRef(): string {
    return this.transactionRef.getValue();
  }

  getMetadata(): Record<string, unknown> {
    return this.metadata;
  }
}

/**
 * Payment Transaction History - track payment updates
 */
export class PaymentTransactionHistory {
  private constructor(
    private readonly id: number | null,
    private readonly paymentRequestId: number,
    private readonly status: PaymentStatus,
    private readonly gatewayResponseCode: string,
    private readonly gatewayMessage: string,
    private readonly gatewayTransactionId: string,
    private readonly metadata: Record<string, unknown>,
    private readonly createdAt: Date
  ) {}

  static create(params: {
    id?: number | null;
    paymentRequestId: number;
    status: PaymentStatus;
    gatewayResponseCode: string;
    gatewayMessage: string;
    gatewayTransactionId: string;
    metadata?: Record<string, unknown>;
    createdAt?: Date;
  }): PaymentTransactionHistory {
    return new PaymentTransactionHistory(
      params.id ?? null,
      params.paymentRequestId,
      params.status,
      params.gatewayResponseCode,
      params.gatewayMessage,
      params.gatewayTransactionId,
      params.metadata ?? {},
      params.createdAt ?? new Date()
    );
  }

  getId(): number | null {
    return this.id;
  }

  getPaymentRequestId(): number {
    return this.paymentRequestId;
  }

  getStatus(): PaymentStatus {
    return this.status;
  }

  getGatewayResponseCode(): string {
    return this.gatewayResponseCode;
  }

  getGatewayMessage(): string {
    return this.gatewayMessage;
  }

  getGatewayTransactionId(): string {
    return this.gatewayTransactionId;
  }

  getMetadata(): Record<string, unknown> {
    return this.metadata;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
}
