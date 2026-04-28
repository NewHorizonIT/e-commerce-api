import { IGatewayService } from '@/module/payment/application/gateway_service';
import { createHmac } from 'crypto';
import { appLogger } from '@/shared/logging/appLogger';

/**
 * ZaloPay Gateway Service Implementation
 * Reference: https://developers.zalopay.vn/
 */
export class ZaloPayGatewayService implements IGatewayService {
  private readonly zaloPayUrl: string;
  private readonly appId: string;
  private readonly key1: string;
  private readonly key2: string;
  private readonly appUrl: string;

  constructor() {
    this.zaloPayUrl = process.env.ZALOPAY_URL || 'https://sandbox.zalopay.vn/api/v2/create';
    this.appId = process.env.ZALOPAY_APP_ID || '';
    this.key1 = process.env.ZALOPAY_KEY1 || '';
    this.key2 = process.env.ZALOPAY_KEY2 || '';
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!this.appId || !this.key1 || !this.key2) {
      appLogger.warn('ZaloPay configuration incomplete');
    }
  }

  getGatewayName(): string {
    return 'zalopay';
  }

  async initiatePayment(params: {
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
  }> {
    try {
      const timestamp = Date.now();
      const app_trans_id = `${timestamp}-${params.orderId}`;

      const data = {
        app_id: this.appId,
        app_trans_id,
        app_user: `user-${params.additionalData?.accountId || '0'}`,
        app_time: timestamp,
        amount: params.amount,
        description: `Payment for order ${params.orderId}`,
        item: '[]',
        embed_data: JSON.stringify({
          transactionRef: params.transactionRef,
          redirectUrl: params.returnUrl,
        }),
        bank_code: '',
        callback_url: params.notifyUrl || `${this.appUrl}/payment/webhook/zalopay`,
      };

      // Create MAC
      const mac = this.createMac(data);

      // In production, make HTTP request to ZaloPay API
      // For now, return payment URL (would be received from ZaloPay)
      const paymentUrl = `${this.zaloPayUrl}?app_id=${data.app_id}&app_trans_id=${app_trans_id}`;

      return {
        paymentUrl,
        gatewayTransactionId: app_trans_id,
        metadata: {
          gateway: 'zalopay',
          appId: this.appId,
          initiatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      appLogger.error('ZaloPay payment initiation error', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async verifyCallbackSignature(data: Record<string, unknown>, signature: string): Promise<boolean> {
    try {
      const computed = this.createMac(data);
      return computed === signature;
    } catch (error) {
      appLogger.error('ZaloPay signature verification error', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  async checkPaymentStatus(gatewayTransactionId: string): Promise<{
    status: 'pending' | 'completed' | 'failed';
    responseCode: string;
    message: string;
    amount?: number;
  }> {
    // In production, you would query ZaloPay API
    // For now, return pending status
    return {
      status: 'pending',
      responseCode: '000',
      message: 'Transaction processing',
    };
  }

  private createMac(data: Record<string, unknown>): string {
    const dataString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');

    const hmac = createHmac('sha256', this.key1);
    return hmac.update(dataString).digest('hex');
  }
}
