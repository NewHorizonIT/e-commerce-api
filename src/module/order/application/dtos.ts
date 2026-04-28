import { OrderStatus, PaymentMethod } from '../domain/value_objects';

export interface PaginationQueryDTO {
  page: number;
  limit: number;
}

export interface OrderListQueryDTO extends PaginationQueryDTO {
  accountId?: number;
  shippingInfoId?: number;
  discountCodeId?: number;
  status?: OrderStatus;
  sortBy?: 'orderDate' | 'totalAmount';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSummaryDTO {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalProductAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  isPaid: boolean;
}

export interface OrderItemDTO {
  id: number;
  productNameSnapshot: string;
  variantNameSnapshot: string;
  priceBeforeDiscount: number;
  priceAfterDiscount: number;
  quantity: number;
  totalAmount: number;
  //   orderId: number;
  variantId: number;
}

export interface OrderStatusHistoryDTO {
  id: number;
  note: string | null;
  changedAt: string;
  oldStatus: string | null;
  newStatus: string;
  //   orderId: number;
}

export interface OrderDetailDTO {
  id: number;
  status: OrderStatus;
  orderDate: string;
  totalProductAmount: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  bankTransferTime: string | null;
  bankTransferTransactionCode: string | null;
  note: string | null;
  accountId: number;
  shippingInfoId: number;
  discountCodeId: number | null;
  items: OrderItemDTO[];
  histories: OrderStatusHistoryDTO[];
}

export interface PaginatedOrdersDTO {
  items: OrderDetailDTO[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface CreateOrderDTO {
  shippingFee?: number;
  discountAmount?: number;
  paymentMethod: PaymentMethod;
  note?: string;
  accountId: number;
  shippingInfoId: number;
  discountCodeId?: number;
  items: {
    variantId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderPaymentDTO {
  isPaid: boolean;
  paymentMethod: PaymentMethod;
  bankTransferTime?: Date | null;
  bankTransferTransactionCode?: string | null;
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
  note?: string;
}
