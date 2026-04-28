import crypto from 'crypto';
import { TypeORMOrderRepository } from '@/module/order/infrastructure/repository';
import { BadRequestError } from '@/shared/error/error';
import { UpdateOrderPaymentDTO } from '@/module/order/application/dtos';
import { PAYMENT_METHOD_VALUE } from '@/module/order/domain/value_objects';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';
import axios from 'axios';
import qs from 'qs';

export default class ZalopayService {
  private appId: string;
  private key1: string;
  private key2: string;
  private endpoint: string;
  private callbackUrl: string;
  private orderRepo: TypeORMOrderRepository;

  constructor() {
    this.appId = process.env.ZALOPAY_APP_ID || '';
    this.key1 = process.env.ZALOPAY_KEY1 || '';
    this.key2 = process.env.ZALOPAY_KEY2 || ''; // dùng verify callback
    this.endpoint = process.env.ZALOPAY_ENDPOINT || 'https://sb-openapi.zalopay.vn/v2/create';
    this.callbackUrl =
      process.env.ZALOPAY_CALLBACK_URL || 'http://localhost:4444/api/v1/payment/zalopay/callback';
    this.orderRepo = new TypeORMOrderRepository();
  }

  private getCurrentDateYYMMDD() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yy}${mm}${dd}`;
  }

  zalopayInitiate = async (initiatePayment: InitiatePaymentDTO) => {
    const order = await this.orderRepo.findOrderById(initiatePayment.getOrderId());
    if (!order) {
      throw new BadRequestError('Order not found');
    }

    const appTransId = `${this.getCurrentDateYYMMDD()}_${Date.now()}`;
    const appTime = Date.now();
    const appUser = `user_${order.id}`;
    const amount = Number(order.totalAmount);
    const embedData = {
      orderId: order.id, // 🔥 để callback lấy lại order
    };
    const items: any[] = [];
    const description = `Thanh toán hoá đơn ${order.id}`;
    const macData = [
      this.appId,
      appTransId,
      appUser,
      amount,
      appTime,
      JSON.stringify(embedData),
      JSON.stringify(items),
    ].join('|');
    const mac = crypto.createHmac('sha256', this.key1).update(macData).digest('hex');

    const payload = {
      app_id: this.appId,
      app_trans_id: appTransId,
      app_user: appUser,
      app_time: appTime,
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embedData),
      amount,
      description,
      bank_code: '',
      callback_url: this.callbackUrl,
      mac,
    };

    const response = await axios.post(this.endpoint, qs.stringify(payload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      ...response.data,
      app_trans_id: appTransId,
    };
  };

  zalopayCallback = async (body: any) => {
    const { data, mac } = body;

    const checkMac = crypto.createHmac('sha256', this.key2).update(data).digest('hex');
    if (checkMac !== mac) {
      throw new BadRequestError('Invalid MAC');
    }

    const parsedData = JSON.parse(data);
    const { embed_data, amount, app_trans_id } = parsedData;
    const embed = JSON.parse(embed_data);

    const orderId = embed.orderId;
    const order = await this.orderRepo.findOrderById(orderId);
    if (!order) {
      throw new BadRequestError('Order not found');
    }
    if (order.isPaid) {
      throw new BadRequestError('Order already paid');
    }

    await this.orderRepo.updateOrderPayment(orderId, {
      isPaid: true,
      paymentMethod: PAYMENT_METHOD_VALUE.ZALOPAY_WALLET,
      bankTransferTime: new Date(),
      bankTransferTransactionCode: app_trans_id,
    } as UpdateOrderPaymentDTO);

    return {
      statusCode: 200,
      message: 'Thanh toán bằng ví ZaloPay thành công',
    };
  };
}
