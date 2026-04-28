import { IGatewayService } from '@/module/payment/application/gateway_service';
import { createHmac } from 'crypto';
import qs from 'qs';
import { appLogger } from '@/shared/logging/appLogger';
import moment from 'moment';

export class VNPayGatewayService implements IGatewayService {
  private readonly vnpayUrl: string;
  private readonly tmnCode: string;
  private readonly hashSecret: string;
  private readonly appUrl: string;

  constructor() {
    this.vnpayUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';

    this.tmnCode = process.env.VNPAY_TMN_CODE || '';
    this.hashSecret = process.env.VNPAY_HASH_SECRET || '';
    this.appUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!this.tmnCode || !this.hashSecret) {
      appLogger.warn('VNPay configuration incomplete');
    }
  }

  getGatewayName(): string {
    return 'vnpay';
  }

  async initiatePayment(params: {
    req: Request;
    orderId: number;
    amount: number;
    transactionRef: string;
    returnUrl: string;
    ipAddr: string;
  }) {
    try {
      const createDate = moment(new Date()).format('YYYYMMDDHHmmss');
      const expireDate = moment(new Date(Date.now() + 15 * 60 * 1000)).format('YYYYMMDDHHmmss');

      const vnp_Params: Record<string, string> = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode: this.tmnCode,
        vnp_Locale: 'vn',
        vnp_CurrCode: 'VND',
        vnp_TxnRef: String(params.orderId),
        vnp_OrderInfo: `Thanh toan don hang ${params.orderId}`,
        vnp_OrderType: 'other',
        vnp_Amount: String(Math.round(params.amount) * 100),
        vnp_ReturnUrl: params.returnUrl,
        vnp_IpAddr: params.ipAddr || '127.0.0.1',
        vnp_CreateDate: createDate,
        vnp_ExpireDate: expireDate,
      };

      const sortedParams = this.sortObject(vnp_Params);
      const signData = qs.stringify(sortedParams, { encode: false });
      const signed = createHmac('sha512', this.hashSecret).update(signData, 'utf-8').digest('hex');
      vnp_Params.vnp_SecureHash = signed;
      const query = qs.stringify(sortedParams, { encode: false });
      const paymentUrl = `${this.vnpayUrl}?${query}&vnp_SecureHash=${signed}`;

      return {
        paymentUrl,
        gatewayTransactionId: params.transactionRef,
        metadata: {
          gateway: 'vnpay',
          initiatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      appLogger.error('VNPay payment initiation error', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async verifyCallbackSignature(data: Record<string, any>) {
    try {
      const vnp_Params = { ...data };

      const secureHash = vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHash'];
      delete vnp_Params['vnp_SecureHashType'];

      const sorted = this.sortObject(vnp_Params);

      // 🔥 MUST MATCH EXACT SAME RULE
      const signData = qs.stringify(sorted, { encode: false });

      const computed = createHmac('sha512', this.hashSecret)
        .update(signData, 'utf-8')
        .digest('hex');

      return secureHash === computed;
    } catch (error) {
      appLogger.error('VNPay signature verification error', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  private sortObject(obj: Record<string, any>) {
    // return Object.keys(obj)
    //   .sort()
    //   .reduce((acc: Record<string, any>, key) => {
    //     acc[key] = obj[key];
    //     return acc;
    //   }, {});
    const sorted: Record<string, string> = {};
    let str = [] as string[];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }

  async checkPaymentStatus() {
    return {
      status: 'pending' as const,
      responseCode: '00',
      message: 'Transaction processing',
    };
  }
}
