import { IGatewayService } from '@/module/payment/application/gateway_service';
import { createHmac } from 'crypto';
import { appLogger } from '@/shared/logging/appLogger';

/**
 * Momo Gateway Service Implementation
 * Reference: https://developers.momo.vn/
 */
export class MomoGatewayService implements IGatewayService {
  private readonly momoUrl: string;
  private readonly partnerCode: string;
  private readonly accessKey: string;
  private readonly secretKey: string;
  private readonly appUrl: string;

  constructor() {
    this.momoUrl = process.env.MOMO_URL || 'https://test-payment.momo.vn/v3/gateway';
    this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
    this.accessKey = process.env.MOMO_ACCESS_KEY || '';
    this.secretKey = process.env.MOMO_SECRET_KEY || '';
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!this.partnerCode || !this.accessKey || !this.secretKey) {
      appLogger.warn('Momo configuration incomplete');
    }
  }

  getGatewayName(): string {
    return 'momo';
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
      const requestId = `${params.transactionRef}-${Date.now()}`;
      const requestBody = {
        partnerCode: this.partnerCode,
        partnerName: 'E-Commerce API',
        requestId,
        amount: params.amount,
        orderId: String(params.orderId),
        orderInfo: `Payment for order ${params.orderId}`,
        requestType: 'getPayLink',
        redirectUrl: params.returnUrl,
        ipnUrl: params.notifyUrl || `${this.appUrl}/payment/webhook/momo`,
        lang: 'vi',
        autoCapture: true,
        extraData: params.additionalData ? JSON.stringify(params.additionalData) : '',
      };

      // Create signature
      const signature = this.createSignature(requestBody);

      // In production, make HTTP request to Momo API
      // For now, return payment URL (would be received from Momo)
      const paymentUrl = `${this.momoUrl}?partnerCode=${requestBody.partnerCode}&requestId=${requestId}`;

      return {
        paymentUrl,
        gatewayTransactionId: requestId,
        metadata: {
          gateway: 'momo',
          partnerId: this.partnerCode,
          initiatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      appLogger.error('Momo payment initiation error', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async verifyCallbackSignature(
    data: Record<string, unknown>,
    signature: string
  ): Promise<boolean> {
    try {
      const computed = this.createSignature(data);
      return computed === signature;
    } catch (error) {
      appLogger.error('Momo signature verification error', {
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
    // In production, you would query Momo API
    // For now, return pending status
    return {
      status: 'pending',
      responseCode: '0',
      message: 'Transaction processing',
    };
  }

  private createSignature(data: Record<string, unknown>): string {
    const dataString = Object.keys(data)
      .sort()
      .map((key) => `${key}=${data[key]}`)
      .join('&');

    const hmac = createHmac('sha256', this.secretKey);
    return hmac.update(dataString).digest('hex');
  }
}
