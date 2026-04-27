import { Request, Response } from 'express';
import CodService from '../services/cod';
import { InitiatePaymentDTO } from '../dtos/initiate-payment';

export default class CodController {
  private codService: CodService;

  constructor() {
    this.codService = new CodService();
  }

  codPayment = async (req: Request, res: Response) => {
    const dto = new InitiatePaymentDTO(req.body);

    const result = await this.codService.codPayment(dto);

    return res.json(result);
  };
}
