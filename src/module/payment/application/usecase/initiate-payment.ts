import { InitiatePaymentDTO, PaymentInitiationResponseDTO } from '../dtos';
import { IGatewayService, IPaymentStorage } from '../gateway_service';
import { PaymentRequest, PaymentResponse } from '@/module/payment/domain/domain';
import {
  PAYMENT_GATEWAY_VALUES,
  PAYMENT_METHOD_VALUES,
} from '@/module/payment/domain/value_objects';
import {
  InvalidPaymentGatewayError,
  InvalidPaymentMethodError,
  InvalidPaymentAmountError,
  MissingOrderIdError,
  PaymentInitiationFailedError,
} from '@/module/payment/domain/errors';
import { appLogger } from '@/shared/logging/appLogger';

export class InitiatePaymentUseCase {
  constructor(
    private readonly gateways: Map<string, IGatewayService>,
    private readonly storage: IPaymentStorage
  ) {}

  async execute(params: InitiatePaymentDTO): Promise<PaymentInitiationResponseDTO> {
    // Validation
    if (!params.orderId) throw new MissingOrderIdError();
    if (!PAYMENT_GATEWAY_VALUES.includes(params.gateway)) throw new InvalidPaymentGatewayError();
    if (!PAYMENT_METHOD_VALUES.includes(params.method)) throw new InvalidPaymentMethodError();
    if (params.amount <= 0) throw new InvalidPaymentAmountError();

    const gateway = this.gateways.get(params.gateway);
    if (!gateway) throw new InvalidPaymentGatewayError();

    // Generate unique transaction reference
    const transactionRef = `${params.gateway}-${params.orderId}-${Date.now()}`;

    try {
      // Save payment request to storage
      const paymentData = await this.storage.savePaymentRequest({
        orderId: params.orderId,
        accountId: params.accountId,
        gateway: params.gateway,
        method: params.method,
        amount: params.amount,
        transactionRef,
        status: 'pending',
        successUrl: params.successUrl || '',
        cancelUrl: params.cancelUrl || '',
      });

      // Call gateway to initiate payment
      const gatewayResponse = await gateway.initiatePayment({
        orderId: params.orderId,
        amount: params.amount,
        transactionRef,
        returnUrl: params.successUrl || `${process.env.APP_URL}/payment/callback`,
        notifyUrl: `${process.env.APP_URL}/payment/webhook/${params.gateway}`,
        additionalData: {
          accountId: params.accountId,
          method: params.method,
        },
      });

      appLogger.info('Payment initiated', {
        orderId: params.orderId,
        gateway: params.gateway,
        transactionRef,
        amount: params.amount,
      });

      return {
        paymentUrl: gatewayResponse.paymentUrl,
        transactionRef,
        gateway: params.gateway,
        gatewayTransactionId: gatewayResponse.gatewayTransactionId,
        metadata: gatewayResponse.metadata,
      };
    } catch (error) {
      appLogger.error('Payment initiation failed', {
        orderId: params.orderId,
        gateway: params.gateway,
        error: error instanceof Error ? error.message : String(error),
      });

      throw new PaymentInitiationFailedError(
        params.gateway,
        error instanceof Error ? error.message : undefined
      );
    }
  }
}
