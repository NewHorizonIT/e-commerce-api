/**
 * Gateway service interface for payment processing
 * Each gateway (VNPay, Momo, ZaloPay) implements this interface
 */
export interface IGatewayService {
  /**
   * Initiate payment and get payment URL
   */
  initiatePayment(params: {
    orderId: number;
    amount: number;
    transactionRef: string;
    returnUrl: string;
    notifyUrl?: string;
    additionalData?: Record<string, unknown>;
  }): Promise<{
    paymentUrl: string;
    gatewayTransactionId: string;
    metadata: Record<string, unknown>;
  }>;

  /**
   * Verify callback signature from gateway
   */
  verifyCallbackSignature(data: Record<string, unknown>, signature: string): Promise<boolean>;

  /**
   * Check payment status from gateway
   */
  checkPaymentStatus(gatewayTransactionId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    responseCode: string;
    message: string;
    amount?: number;
  }>;

  /**
   * Get gateway name
   */
  getGatewayName(): string;
}

/**
 * Storage interface for persisting payment data
 */
export interface IPaymentStorage {
  /**
   * Save payment request
   */
  savePaymentRequest(data: {
    orderId: number;
    accountId: number;
    gateway: string;
    method: string;
    amount: number;
    transactionRef: string;
    status: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ id: number }>;

  /**
   * Update payment request status
   */
  updatePaymentStatus(transactionRef: string, status: string, updatedAt: Date): Promise<void>;

  /**
   * Get payment request by transaction reference
   */
  getPaymentByTransactionRef(transactionRef: string): Promise<{
    id: number;
    orderId: number;
    accountId: number;
    gateway: string;
    method: string;
    amount: number;
    transactionRef: string;
    status: string;
    successUrl: string;
    cancelUrl: string;
    createdAt: Date;
    updatedAt: Date;
  } | null>;

  /**
   * Save payment transaction history
   */
  savePaymentHistory(data: {
    paymentRequestId: number;
    status: string;
    gatewayResponseCode: string;
    gatewayMessage: string;
    gatewayTransactionId: string;
    metadata: Record<string, unknown>;
  }): Promise<void>;

  /**
   * Get payment history
   */
  getPaymentHistory(transactionRef: string): Promise<
    Array<{
      id: number;
      paymentRequestId: number;
      status: string;
      gatewayResponseCode: string;
      gatewayMessage: string;
      gatewayTransactionId: string;
      metadata: Record<string, unknown>;
      createdAt: Date;
    }>
  >;
}
