import { Request, Response } from 'express';
import MomoService from '../services/momo';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';

export default class MomoController {
  private momoService;

  constructor() {
    this.momoService = new MomoService();
  }

  momoInitiate = async (req: Request, res: Response) => {
    const dto = new InitiatePaymentDTO(req.body);

    const data = await this.momoService.momoInitiate(dto);

    return res.json({
      status: 200,
      message: 'Tạo đơn hàng bằng ví MoMo thành công!',
      data,
    });
  };

  momoCallback = async (req: Request, res: Response) => {
    /**
     * ⚠️ MoMo có 2 kiểu callback:
     * - redirectUrl → req.query
     * - ipnUrl      → req.body
     *
     * 👉 Chuẩn nhất: dùng body (IPN)
     */
    // const data = Object.keys(req.body).length ? req.body : req.query;
    const data = req.query;

    const result = await this.momoService.momoCallback(data);

    return res.json(result);
  };
}
