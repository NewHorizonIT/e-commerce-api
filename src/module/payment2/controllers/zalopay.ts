import { Request, Response } from 'express';
import ZalopayService from '../services/zalopay';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';

export default class ZalopayController {
  private zalopayService;

  constructor() {
    this.zalopayService = new ZalopayService();
  }

  zalopayInitiate = async (req: Request, res: Response) => {
    const dto = new InitiatePaymentDTO(req.body);

    const result = await this.zalopayService.zalopayInitiate(dto);

    return res.json({
      status: 200,
      message: 'Tạo đơn hàng bằng ví ZaloPay thành công!',
      data: {
        orderUrl: result.order_url,
        raw: result,
      },
    });
  };

  zalopayCallback = async (req: Request, res: Response) => {
    const result = await this.zalopayService.zalopayCallback(req.body);
    return res.json(result);
  };
}
