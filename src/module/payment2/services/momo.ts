import crypto from 'crypto';
import https from 'https';
import { TypeORMOrderRepository } from '@/module/order/infrastructure/repository';
import { BadRequestError } from '@/shared/error/error';
import { UpdateOrderPaymentDTO } from '@/module/order/application/dtos';
import { PAYMENT_METHOD_VALUE } from '@/module/order/domain/value_objects';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';
import { generatePayID } from '../utils/generate-pay-id';

export default class MomoService {
  private accessKey: string;
  private secretKey: string;
  private partnerCode: string;
  private redirectUrl: string;
  private ipnUrl: string;
  private orderRepo: TypeORMOrderRepository;

  constructor() {
    this.accessKey = process.env.MOMO_ACCESS_KEY || '';
    this.secretKey = process.env.MOMO_SECRET_KEY || '';
    this.partnerCode = process.env.MOMO_PARTNER_CODE || '';
    this.redirectUrl =
      process.env.MOMO_REDIRECT_URL || 'http://localhost:4444/api/v1/payment/momo/callback';
    this.ipnUrl = process.env.MOMO_IPN_URL || 'http://localhost:4444/api/v1/payment/momo/callback';

    this.orderRepo = new TypeORMOrderRepository();
  }

  momoInitiate = async (initiatePayment: InitiatePaymentDTO) => {
    const orderSelected = await this.orderRepo.findOrderById(initiatePayment.getOrderId());
    if (!orderSelected) {
      throw new BadRequestError('Order not found');
    }

    const requestId = `${this.partnerCode}_${Date.now()}`;
    const orderId = `${generatePayID('MOMO', orderSelected.id)}`;
    const amount = Number(orderSelected.totalAmount);
    const orderInfo = `Thanh toan don hang ${orderSelected.id}`;
    const extraData = '';

    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&ipnUrl=${this.ipnUrl}` +
      `&orderId=${orderId}` +
      `&orderInfo=${orderInfo}` +
      `&partnerCode=${this.partnerCode}` +
      `&redirectUrl=${this.redirectUrl}` +
      `&requestId=${requestId}` +
      `&requestType=payWithMethod`;

    const signature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');

    const requestBody = JSON.stringify({
      partnerCode: this.partnerCode,
      partnerName: 'Test',
      storeId: 'MomoStore',
      requestId,
      amount,
      orderId: orderId,
      orderInfo,
      redirectUrl: this.redirectUrl,
      ipnUrl: this.ipnUrl,
      lang: 'vi',
      requestType: 'payWithMethod',
      autoCapture: true,
      extraData,
      orderGroupId: '',
      signature,
    });

    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            console.log(data);
            const parsed = JSON.parse(data);

            // ⚠️ Lưu mapping orderId hệ thống
            // vì momoOrderId != order.id
            resolve(parsed);
          } catch (err) {
            reject(err);
          }
        });
      });

      req.on('error', reject);
      req.write(requestBody);
      req.end();
    });
  };

  momoCallback = async (body: any) => {
    const { resultCode, orderId, requestId, amount, signature, extraData } = body;

    if (Number(resultCode) !== 0) {
      throw new BadRequestError('Payment failed');
    }

    const rawSignature =
      `accessKey=${this.accessKey}` +
      `&amount=${amount}` +
      `&extraData=${extraData}` +
      `&message=${body.message}` +
      `&orderId=${orderId}` +
      `&orderInfo=${body.orderInfo}` +
      `&orderType=${body.orderType}` +
      `&partnerCode=${this.partnerCode}` +
      `&payType=${body.payType}` +
      `&requestId=${requestId}` +
      `&responseTime=${body.responseTime}` +
      `&resultCode=${resultCode}` +
      `&transId=${body.transId}`;
    const checkSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(rawSignature)
      .digest('hex');
    if (checkSignature !== signature) {
      throw new BadRequestError('Invalid signature');
    }

    const orderSelected = await this.orderRepo.findOrderById(orderId.split('_')[1]);
    if (!orderSelected) {
      throw new BadRequestError('Order not found');
    }
    if (orderSelected.isPaid) {
      throw new BadRequestError('Order already paid');
    }

    const orderUpdated = await this.orderRepo.updateOrderPayment(orderSelected.id, {
      isPaid: true,
      paymentMethod: PAYMENT_METHOD_VALUE.MOMO_WALLET,
      bankTransferTime: new Date(),
      bankTransferTransactionCode: orderId,
    } as UpdateOrderPaymentDTO);

    return {
      status: 200,
      message: 'Thanh toán bằng ví MoMo thành công',
      data: orderUpdated,
    };
  };
}
