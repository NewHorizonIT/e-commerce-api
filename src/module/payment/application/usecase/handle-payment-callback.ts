import { PaymentCallbackDTO } from '../dtos';
import { IGatewayService, IPaymentStorage } from '../gateway_service';
import { PaymentTransactionHistory } from '@/module/payment/domain/domain';
import { PAYMENT_STATUS_VALUES } from '@/module/payment/domain/value_objects';
import {
  InvalidCallbackDataError,
  TransactionNotFoundError,
  InvalidPaymentStatusError,
} from '@/module/payment/domain/errors';
import { appLogger } from '@/shared/logging/appLogger';
import { auditLog } from '@/shared/logging/auditLogger';

export class HandlePaymentCallbackUseCase {
  constructor(private readonly storage: IPaymentStorage) {}

  async execute(params: PaymentCallbackDTO): Promise<void> {
    // Validate callback data
    if (!params.transactionRef) {
      throw new InvalidCallbackDataError('Transaction reference is required');
    }

    if (!PAYMENT_STATUS_VALUES.includes(params.status)) {
      throw new InvalidPaymentStatusError();
    }

    // Get existing payment request
    const paymentRequest = await this.storage.getPaymentByTransactionRef(params.transactionRef);

    if (!paymentRequest) {
      throw new TransactionNotFoundError(params.transactionRef);
    }

    try {
      // Update payment status
      await this.storage.updatePaymentStatus(params.transactionRef, params.status, new Date());

      // Save transaction history
      await this.storage.savePaymentHistory({
        paymentRequestId: paymentRequest.id,
        status: params.status,
        gatewayResponseCode: params.responseCode,
        gatewayMessage: params.message,
        gatewayTransactionId: params.gatewayTransactionId,
        metadata: params.metadata,
      });

      appLogger.info('Payment callback processed', {
        transactionRef: params.transactionRef,
        gateway: params.gateway,
        status: params.status,
        orderId: paymentRequest.orderId,
      });

      // Audit log for payment status changes
      //   AuditLog.log(
      //     'payment:callback',
      //     {
      //       transactionRef: params.transactionRef,
      //       previousStatus: paymentRequest.status,
      //       newStatus: params.status,
      //       gateway: params.gateway,
      //       orderId: paymentRequest.orderId,
      //     },
      //     'Payment callback processed'
      //   );
      await auditLog({
        actorId: 'system', // hoặc userId nếu có
        action: 'payment:callback',
        resource: 'payment',
        resourceId: params.transactionRef,
        oldValue: paymentRequest.status,
        newValue: params.status,
        traceId: params.gateway,
      });
    } catch (error) {
      appLogger.error('Payment callback processing failed', {
        transactionRef: params.transactionRef,
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
