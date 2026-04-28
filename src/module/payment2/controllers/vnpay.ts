import { Request, Response } from 'express';
import VnpayService from '../services/vnpay';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';

export default class VnpayController {
  private vnpayService;

  constructor() {
    this.vnpayService = new VnpayService();
  }

  vnpayInitiate = async (req: Request, res: Response) => {
    const dto = new InitiatePaymentDTO(req.body);

    let ipAddr = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
    if (ipAddr === '::1') {
      ipAddr = '127.0.0.1';
    }
    const url = await this.vnpayService.vnpayInitiate(dto, ipAddr);

    return res.json({
      status: 200,
      message: 'Tạo đơn hàng bằng ví VNPAY thành công!',
      data: {
        paymentUrl: url,
      },
    });
  };

  vnpayCallback = async (req: Request, res: Response) => {
    const result = await this.vnpayService.vnpayCallback(req.query);
    return res.json(result);
  };
}
