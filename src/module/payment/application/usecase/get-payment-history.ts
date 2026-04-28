import { PaymentHistoryDTO, PaymentHistoryItemDTO } from '../dtos';
import { IPaymentStorage } from '../gateway_service';
import { TransactionNotFoundError } from '@/module/payment/domain/errors';

export class GetPaymentHistoryUseCase {
  constructor(private readonly storage: IPaymentStorage) {}

  async execute(transactionRef: string): Promise<PaymentHistoryDTO> {
    const paymentRequest = await this.storage.getPaymentByTransactionRef(transactionRef);

    if (!paymentRequest) {
      throw new TransactionNotFoundError(transactionRef);
    }

    const history = await this.storage.getPaymentHistory(transactionRef);

    const historyItems: PaymentHistoryItemDTO[] = history.map((item) => ({
      status: item.status as any,
      responseCode: item.gatewayResponseCode,
      message: item.gatewayMessage,
      timestamp: item.createdAt.toISOString(),
    }));

    return {
      id: paymentRequest.id,
      transactionRef: paymentRequest.transactionRef,
      status: paymentRequest.status as any,
      gateway: paymentRequest.gateway as any,
      amount: paymentRequest.amount,
      orderId: paymentRequest.orderId,
      history: historyItems,
    };
  }
}
