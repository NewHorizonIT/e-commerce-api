import { PaymentGateway, PaymentStatus, PaymentMethod } from '../domain/value_objects';

// ==================== DTOs ====================

export interface InitiatePaymentDTO {
  orderId: number;
  accountId: number;
  gateway: PaymentGateway;
  method: PaymentMethod;
  amount: number;
  successUrl?: string;
  cancelUrl?: string;
}

export interface PaymentInitiationResponseDTO {
  paymentUrl: string;
  transactionRef: string;
  gateway: PaymentGateway;
  gatewayTransactionId: string;
  metadata: Record<string, unknown>;
}

export interface PaymentCallbackDTO {
  gateway: PaymentGateway;
  transactionRef: string;
  gatewayTransactionId: string;
  status: PaymentStatus;
  responseCode: string;
  message: string;
  metadata: Record<string, unknown>;
}

export interface PaymentStatusDTO {
  transactionRef: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  amount: number;
  orderId: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentHistoryDTO {
  id: number;
  transactionRef: string;
  status: PaymentStatus;
  gateway: PaymentGateway;
  amount: number;
  orderId: number;
  history: PaymentHistoryItemDTO[];
}

export interface PaymentHistoryItemDTO {
  status: PaymentStatus;
  responseCode: string;
  message: string;
  timestamp: string;
}

export interface VNPayInitiationParamsDTO {
  orderId: number;
  amount: number;
  orderDescription: string;
  locale?: string;
  returnUrl: string;
}

export interface MomoInitiationParamsDTO {
  orderId: number;
  amount: number;
  orderInfo: string;
  returnUrl: string;
  notifyUrl: string;
}

export interface ZaloPayInitiationParamsDTO {
  orderId: number;
  amount: number;
  description: string;
  redirectUrl: string;
  notifyUrl: string;
}
