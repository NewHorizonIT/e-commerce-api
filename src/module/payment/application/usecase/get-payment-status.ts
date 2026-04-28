import { PaymentStatusDTO } from '../dtos';
import { IPaymentStorage } from '../gateway_service';
import { TransactionNotFoundError } from '@/module/payment/domain/errors';

export class GetPaymentStatusUseCase {
  constructor(private readonly storage: IPaymentStorage) {}

  async execute(transactionRef: string): Promise<PaymentStatusDTO> {
    const paymentRequest = await this.storage.getPaymentByTransactionRef(transactionRef);

    if (!paymentRequest) {
      throw new TransactionNotFoundError(transactionRef);
    }

    return {
      transactionRef: paymentRequest.transactionRef,
      status: paymentRequest.status as any,
      gateway: paymentRequest.gateway as any,
      amount: paymentRequest.amount,
      orderId: paymentRequest.orderId,
      createdAt: paymentRequest.createdAt.toISOString(),
      updatedAt: paymentRequest.updatedAt.toISOString(),
    };
  }
}
