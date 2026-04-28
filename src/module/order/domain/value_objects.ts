export const ORDER_STATUS_VALUE = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPING: 'shipping',
  DELIVERED: 'delivered',
  REVIEWED: 'reviewed',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUE)[keyof typeof ORDER_STATUS_VALUE];

export const PAYMENT_METHOD_VALUE = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  VNPAY_WALLET: 'vnpay_wallet',
  MOMO_WALLET: 'momo_wallet',
  ZALOPAY_WALLET: 'zalopay_wallet',
} as const;

export type PaymentMethod = (typeof PAYMENT_METHOD_VALUE)[keyof typeof PAYMENT_METHOD_VALUE];
