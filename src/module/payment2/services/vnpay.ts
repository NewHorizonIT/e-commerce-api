import { appLogger } from '@/shared/logging/appLogger';
import { dateFormat, HashAlgorithm, ignoreLogger, ProductCode, VNPay, VnpLocale } from 'vnpay';
import { TypeORMOrderRepository } from '@/module/order/infrastructure/repository';
import { BadRequestError } from '@/shared/error/error';
import { UpdateOrderPaymentDTO } from '@/module/order/application/dtos';
import { PAYMENT_METHOD_VALUE } from '@/module/order/domain/value_objects';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';
import { generatePayID } from '../utils/generate-pay-id';

process.env.TZ = 'Asia/Ho_Chi_Minh';

export default class VnpayService {
  private vnpayUrl: string;
  private vnpayReturnUrl: string;
  private tmnCode: string;
  private hashSecret: string;
  private appUrl: string;
  private orderRepo: TypeORMOrderRepository;

  constructor() {
    this.vnpayUrl = process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    this.vnpayReturnUrl =
      process.env.VNPAY_RETURN_URL || 'http://localhost:4444/api/v1/payment/vnpay/callback';
    this.tmnCode = process.env.VNPAY_TMN_CODE || '';
    this.hashSecret = process.env.VNPAY_HASH_SECRET || '';
    this.appUrl = process.env.APP_URL || 'http://localhost:4444';
    this.orderRepo = new TypeORMOrderRepository();

    if (!this.tmnCode || !this.hashSecret) {
      appLogger.warn('VNPay configuration incomplete');
    }
  }

  vnpayInitiate = async (initiatePayment: InitiatePaymentDTO, ipAddr: string) => {
    const orderSelected = await this.orderRepo.findOrderById(initiatePayment.getOrderId());
    if (!orderSelected) {
      throw new BadRequestError('Order not found');
    }

    const vnpay = new VNPay({
      tmnCode: this.tmnCode,
      secureSecret: this.hashSecret,
      vnpayHost: 'https://sandbox.vnpayment.vn',
      testMode: true, // tùy chọn
      hashAlgorithm: 'SHA512' as HashAlgorithm, // tùy chọn
      loggerFn: ignoreLogger, // tùy chọn
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const vnpayResponse = vnpay.buildPaymentUrl({
      vnp_Amount: orderSelected.totalAmount,
      vnp_IpAddr: ipAddr,
      vnp_TxnRef: `${generatePayID('VNPAY', orderSelected.id)}`,
      vnp_OrderInfo: `Thanh toan don hang ${orderSelected.id}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.vnpayReturnUrl,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(tomorrow),
    });

    return vnpayResponse;
  };

  vnpayCallback = async (query: any) => {
    const vnp_Params = { ...query };

    const responseCode = vnp_Params['vnp_ResponseCode'];
    const orderId = vnp_Params['vnp_TxnRef'].split('_')[1];

    if (responseCode !== '00') {
      throw new BadRequestError('Unsuccess payment');
    }

    const orderSelected = await this.orderRepo.findOrderById(orderId);
    if (!orderSelected) {
      throw new BadRequestError('Order not found');
    }
    if (orderSelected.isPaid) {
      throw new BadRequestError('Order already paid');
    }

    const orderUpdated = await this.orderRepo.updateOrderPayment(orderId, {
      isPaid: true,
      paymentMethod: PAYMENT_METHOD_VALUE.VNPAY_WALLET,
      bankTransferTime: new Date(),
      bankTransferTransactionCode: vnp_Params['vnp_TxnRef'],
    } as UpdateOrderPaymentDTO);

    return {
      status: 200,
      message: 'Thanh toán bằng ví VNPay thành công',
      data: { orderUpdated },
    };
  };
}
