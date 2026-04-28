import type { Request, Response } from 'express';
import { IOrderModulePort } from '../application/module_port';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';
import { ForbiddenError } from '@/shared/error/error';

export class OrderController {
  constructor(private readonly orderModulePort: IOrderModulePort) {}

  private isAdminRequest(req: Request): boolean {
    return req.originalUrl.includes('/admin/');
  }

  async listOrders(req: Request, res: Response): Promise<void> {
    const query = this.isAdminRequest(req)
      ? req.query
      : { ...req.query, accountId: String(req.userId) };

    const orders = await this.orderModulePort.listOrders(query as never);
    new SuccessResponse(orders, undefined, StatusCode.OK).send(res);
  }

  async findOrderById(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params as { orderId: string };
    const order = await this.orderModulePort.findOrderById(Number(orderId));

    if (!this.isAdminRequest(req) && order.accountId !== req.userId) {
      throw new ForbiddenError('You do not have permission to access this order');
    }

    new SuccessResponse(order, undefined, StatusCode.OK).send(res);
  }

  async createOrder(req: Request, res: Response): Promise<void> {
    const order = await this.orderModulePort.createOrder({
      ...req.body,
      accountId: req.userId!,
    });
    appLogger.info('Order created', { orderId: order.id });
    new SuccessResponse(order, 'Order created successfully', StatusCode.CREATED).send(res);
  }

  
  async updateOrderStatus(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params as { orderId: string };
    const order = await this.orderModulePort.updateOrderStatus(Number(orderId), req.body);
    new SuccessResponse(order, 'Order status updated', StatusCode.OK).send(res);
  }
  
  async updateOrderPayment(req: Request, res: Response): Promise<void> {
    const { orderId } = req.params as { orderId: string };
    const order = await this.orderModulePort.updateOrderPayment(Number(orderId), req.body);
    new SuccessResponse(order, 'Order payment updated', StatusCode.OK).send(res);
  }

  async hasOrdersByAccount(req: Request, res: Response): Promise<void> {
    const { accountId } = req.params as { accountId: string };
    const exists = await this.orderModulePort.hasOrdersByAccountId(Number(accountId));
    new SuccessResponse({ exists }, undefined, StatusCode.OK).send(res);
  }

  async hasOrdersByShippingInfo(req: Request, res: Response): Promise<void> {
    const { shippingInfoId } = req.params as { shippingInfoId: string };
    const exists = await this.orderModulePort.hasOrdersByShippingInfoId(Number(shippingInfoId));
    new SuccessResponse({ exists }, undefined, StatusCode.OK).send(res);
  }

  async hasOrdersByDiscountCode(req: Request, res: Response): Promise<void> {
    const { discountCodeId } = req.params as { discountCodeId: string };
    const exists = await this.orderModulePort.hasOrdersByDiscountCodeId(Number(discountCodeId));
    new SuccessResponse({ exists }, undefined, StatusCode.OK).send(res);
  }
}
