import type { Request, Response } from 'express';
import { IPaymentModulePort } from '../application/module_port';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';

export class PaymentController {
  constructor(private readonly paymentModulePort: IPaymentModulePort) {}

  async initiatePayment(req: Request, res: Response): Promise<void> {
    const { orderId, gateway, method, amount, successUrl, cancelUrl } = req.body;
    const accountId = (req.userId as any)?.id;

    const result = await this.paymentModulePort.initiatePayment({
      orderId,
      accountId,
      gateway,
      method,
      amount,
      successUrl,
      cancelUrl,
    });

    appLogger.info('Payment initiated', {
      req,
      orderId,
      gateway,
      transactionRef: result.transactionRef,
    });

    new SuccessResponse(result, 'Payment initiated successfully', StatusCode.CREATED).send(res);
  }

  async handleCallback(req: Request, res: Response): Promise<void> {
    const {
      gateway,
      transactionRef,
      gatewayTransactionId,
      status,
      responseCode,
      message,
      metadata,
    } = req.body;

    await this.paymentModulePort.handlePaymentCallback({
      gateway,
      transactionRef,
      gatewayTransactionId,
      status,
      responseCode,
      message,
      metadata: metadata || {},
    });

    new SuccessResponse(null, 'Callback processed', StatusCode.OK).send(res);
  }

  async getPaymentStatus(req: Request, res: Response): Promise<void> {
    const { transactionRef } = req.params;

    const status = await this.paymentModulePort.getPaymentStatus(transactionRef as string);

    new SuccessResponse(status, undefined, StatusCode.OK).send(res);
  }

  async getPaymentHistory(req: Request, res: Response): Promise<void> {
    const { transactionRef } = req.params;

    const history = await this.paymentModulePort.getPaymentHistory(transactionRef as string);

    new SuccessResponse(history, undefined, StatusCode.OK).send(res);
  }
}
