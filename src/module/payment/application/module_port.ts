import {
  InitiatePaymentDTO,
  PaymentInitiationResponseDTO,
  PaymentCallbackDTO,
  PaymentStatusDTO,
  PaymentHistoryDTO,
} from './dtos';

export interface IPaymentModulePort {
  initiatePayment(params: InitiatePaymentDTO): Promise<PaymentInitiationResponseDTO>;
  handlePaymentCallback(params: PaymentCallbackDTO): Promise<void>;
  getPaymentStatus(transactionRef: string): Promise<PaymentStatusDTO>;
  getPaymentHistory(transactionRef: string): Promise<PaymentHistoryDTO>;
}
