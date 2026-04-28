import { IPaymentStorage } from '@/module/payment/application/gateway_service';
import { appLogger } from '@/shared/logging/appLogger';

/**
 * In-memory Payment Storage (For Development/Testing)
 * In production, replace with database persistence
 */
export class InMemoryPaymentStorage implements IPaymentStorage {
  private payments: Map<
    string,
    {
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
    }
  > = new Map();

  private history: Array<{
    id: number;
    paymentRequestId: number;
    status: string;
    gatewayResponseCode: string;
    gatewayMessage: string;
    gatewayTransactionId: string;
    metadata: Record<string, unknown>;
    createdAt: Date;
  }> = [];

  private idCounter = 1;
  private historyIdCounter = 1;

  async savePaymentRequest(data: {
    orderId: number;
    accountId: number;
    gateway: string;
    method: string;
    amount: number;
    transactionRef: string;
    status: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<{ id: number }> {
    const id = this.idCounter++;

    this.payments.set(data.transactionRef, {
      id,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    appLogger.info('Payment request saved', {
      id,
      transactionRef: data.transactionRef,
      orderId: data.orderId,
    });

    return { id };
  }

  async updatePaymentStatus(
    transactionRef: string,
    status: string,
    updatedAt: Date
  ): Promise<void> {
    const payment = this.payments.get(transactionRef);

    if (!payment) {
      appLogger.warn('Payment not found for status update', { transactionRef });
      return;
    }

    payment.status = status;
    payment.updatedAt = updatedAt;

    appLogger.info('Payment status updated', {
      transactionRef,
      status,
    });
  }

  async getPaymentByTransactionRef(transactionRef: string): Promise<{
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
  } | null> {
    return this.payments.get(transactionRef) || null;
  }

  async savePaymentHistory(data: {
    paymentRequestId: number;
    status: string;
    gatewayResponseCode: string;
    gatewayMessage: string;
    gatewayTransactionId: string;
    metadata: Record<string, unknown>;
  }): Promise<void> {
    const id = this.historyIdCounter++;

    this.history.push({
      id,
      ...data,
      createdAt: new Date(),
    });

    appLogger.info('Payment history saved', {
      paymentRequestId: data.paymentRequestId,
      status: data.status,
    });
  }

  async getPaymentHistory(transactionRef: string): Promise<
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
  > {
    const payment = this.payments.get(transactionRef);

    if (!payment) {
      return [];
    }

    return this.history.filter((h) => h.paymentRequestId === payment.id);
  }
}
