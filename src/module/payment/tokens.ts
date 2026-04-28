/**
 * Payment Module Tokens
 * Used for dependency injection and module exports
 */

export const PAYMENT_TOKENS = {
  MODULE: 'PaymentModule',
  PUBLIC_API: 'PaymentPublicApi',
  CONTROLLER: 'PaymentController',
  ROUTER: 'PaymentRouter',
  // Use Cases
  INITIATE_PAYMENT_UC: 'InitiatePaymentUseCase',
  HANDLE_CALLBACK_UC: 'HandlePaymentCallbackUseCase',
  GET_STATUS_UC: 'GetPaymentStatusUseCase',
  GET_HISTORY_UC: 'GetPaymentHistoryUseCase',
  // Gateway Services
  VNPAY_SERVICE: 'VNPayGatewayService',
  MOMO_SERVICE: 'MomoGatewayService',
  ZALOPAY_SERVICE: 'ZaloPayGatewayService',
  // Storage
  PAYMENT_STORAGE: 'PaymentStorage',
} as const;
