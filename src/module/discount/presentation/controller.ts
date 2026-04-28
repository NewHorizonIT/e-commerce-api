import type { Request, Response } from 'express';
import { IDiscountModulePort } from '../application/module_port';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';

export class DiscountController {
  constructor(private readonly discountModulePort: IDiscountModulePort) {}

  async listDiscounts(req: Request, res: Response): Promise<void> {
    const discounts = await this.discountModulePort.listDiscounts(req.query as never);
    new SuccessResponse(discounts, undefined, StatusCode.OK).send(res);
  }

  async findDiscountById(req: Request, res: Response): Promise<void> {
    const { discountId } = req.params as { discountId: string };
    const discount = await this.discountModulePort.findDiscountById(Number(discountId));
    new SuccessResponse(discount, undefined, StatusCode.OK).send(res);
  }

  async findDiscountByCode(req: Request, res: Response): Promise<void> {
    const { code } = req.params as { code: string };
    const discount = await this.discountModulePort.findDiscountByCode(code);
    new SuccessResponse(discount, undefined, StatusCode.OK).send(res);
  }

  async createDiscount(req: Request, res: Response): Promise<void> {
    const discount = await this.discountModulePort.createDiscount(req.body);
    appLogger.info('Discount created', { discountId: discount.id });
    new SuccessResponse(discount, 'Discount created successfully', StatusCode.CREATED).send(res);
  }

  async updateDiscount(req: Request, res: Response): Promise<void> {
    const { discountId } = req.params as { discountId: string };
    const discount = await this.discountModulePort.updateDiscount(Number(discountId), req.body);
    new SuccessResponse(discount, 'Discount updated successfully', StatusCode.OK).send(res);
  }

  async updateActiveDiscount(req: Request, res: Response): Promise<void> {
    const { discountId } = req.params as { discountId: string };
    const { isActive } = req.body as { isActive: boolean };
    const discount = await this.discountModulePort.updateActiveDiscount(
      Number(discountId),
      isActive
    );
    new SuccessResponse(
      discount,
      `Discount ${isActive ? 'activated' : 'deactivated'} successfully`,
      StatusCode.OK
    ).send(res);
  }

  async checkDiscountValidity(req: Request, res: Response): Promise<void> {
    const result = await this.discountModulePort.checkDiscountValidity({
      discountCode: req.body.discountCode,
      orderAmount: req.body.orderAmount,
      currentDate: req.body.currentDate ? new Date(req.body.currentDate) : undefined,
    });
    new SuccessResponse(result, undefined, StatusCode.OK).send(res);
  }
}
