import { IPaymentModulePort } from './application/module_port';
import {
  InitiatePaymentDTO,
  PaymentInitiationResponseDTO,
  PaymentCallbackDTO,
  PaymentStatusDTO,
  PaymentHistoryDTO,
} from './application/dtos';
import { InitiatePaymentUseCase } from './application/usecase/initiate-payment';
import { HandlePaymentCallbackUseCase } from './application/usecase/handle-payment-callback';
import { GetPaymentStatusUseCase } from './application/usecase/get-payment-status';
import { GetPaymentHistoryUseCase } from './application/usecase/get-payment-history';

export class PaymentModuleAdapter implements IPaymentModulePort {
  constructor(
    private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
    private readonly handlePaymentCallbackUseCase: HandlePaymentCallbackUseCase,
    private readonly getPaymentStatusUseCase: GetPaymentStatusUseCase,
    private readonly getPaymentHistoryUseCase: GetPaymentHistoryUseCase
  ) {}

  async initiatePayment(params: InitiatePaymentDTO): Promise<PaymentInitiationResponseDTO> {
    return this.initiatePaymentUseCase.execute(params);
  }

  async handlePaymentCallback(params: PaymentCallbackDTO): Promise<void> {
    return this.handlePaymentCallbackUseCase.execute(params);
  }

  async getPaymentStatus(transactionRef: string): Promise<PaymentStatusDTO> {
    return this.getPaymentStatusUseCase.execute(transactionRef);
  }

  async getPaymentHistory(transactionRef: string): Promise<PaymentHistoryDTO> {
    return this.getPaymentHistoryUseCase.execute(transactionRef);
  }
}
