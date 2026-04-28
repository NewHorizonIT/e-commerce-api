import { BadRequestError } from '@/shared/error/error';
import {
  ORDER_STATUS_VALUE,
  OrderStatus,
  PAYMENT_METHOD_VALUE,
  PaymentMethod,
} from './value_objects';
import {
  GreaterThanOrEqualZeroQuantityError,
  InvalidAccountIdError,
  InvalidDiscountCodeIdError,
  InvalidOrderIdError,
  InvalidPaymentMethodError,
  InvalidShippingInfoIdError,
  InvalidStatusError,
  InvalidVariantIdError,
  MissingAccountIdError,
  MissingBankTransferTransactionCodeError,
  MissingDiscountCodeIdError,
  MissingOrderIdError,
  MissingPaymentMethodError,
  MissingShippingInfoIdError,
  MissingVariantIdError,
  NegativeTotalAmountError,
} from './errors';

export class Order {
  private constructor(
    private readonly id: number | null,
    private status: OrderStatus,
    private orderDate: Date,
    private totalProductAmount: number,
    private shippingFee: number,
    private discountAmount: number,
    private totalAmount: number,
    private isPaid: boolean,
    private paymentMethod: PaymentMethod,
    private bankTransferTime: Date | null,
    private bankTransferTransactionCode: string | null,
    private note: string | null,
    private accountId: number,
    private shippingInfoId: number,
    private discountCodeId: number | null,
    private items: OrderItem[],
    private histories: OrderStatusHistory[]
  ) {}

  static create(params: {
    shippingFee?: number;
    discountAmount?: number;
    paymentMethod: PaymentMethod;
    note?: string;
    accountId: number;
    shippingInfoId: number;
    discountCodeId?: number | null;
    items: OrderItem[];
  }): Order {
    if (params.paymentMethod === null) {
      throw new MissingPaymentMethodError();
    }
    if (!Object.values(PAYMENT_METHOD_VALUE).includes(params.paymentMethod)) {
      throw new InvalidPaymentMethodError();
    }
    if (params.accountId === null) {
      throw new MissingAccountIdError();
    }
    if (isNaN(params.accountId) || typeof params.accountId !== 'number') {
      throw new InvalidAccountIdError();
    }
    if (params.shippingInfoId === null) {
      throw new MissingShippingInfoIdError();
    }
    if (isNaN(params.shippingInfoId) || typeof params.shippingInfoId !== 'number') {
      throw new InvalidShippingInfoIdError();
    }

    const order = new Order(
      null,
      ORDER_STATUS_VALUE.PENDING,
      new Date(),
      0,
      params.shippingFee ?? 0,
      params.discountAmount ?? 0,
      0,
      false,
      params.paymentMethod,
      null,
      null,
      params.note?.trim() || null,
      params.accountId,
      params.shippingInfoId,
      params.discountCodeId ?? null,
      [],
      []
    );

    params.items.forEach((item) => order.addItem(item));

    return order;
  }

  static rehydrate(params: {
    id: number;
    status: OrderStatus;
    orderDate: Date;
    totalProductAmount: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    isPaid: boolean;
    paymentMethod: PaymentMethod;
    bankTransferTime: Date | null;
    bankTransferTransactionCode: string | null;
    note: string | null;
    accountId: number;
    shippingInfoId: number;
    discountCodeId: number | null;
    items: OrderItem[];
    histories: OrderStatusHistory[];
  }): Order {
    return new Order(
      params.id,
      params.status,
      params.orderDate,
      params.totalProductAmount,
      params.shippingFee,
      params.discountAmount,
      params.totalAmount,
      params.isPaid,
      params.paymentMethod,
      params.bankTransferTime,
      params.bankTransferTransactionCode,
      params.note,
      params.accountId,
      params.shippingInfoId,
      params.discountCodeId,
      params.items,
      params.histories
    );
  }

  private recalculateTotal() {
    this.totalProductAmount = this.items.reduce((sum, item) => sum + item.getTotalAmount(), 0);

    this.totalAmount = this.totalProductAmount + this.shippingFee - this.discountAmount;

    if (this.totalAmount < 0) {
      throw new NegativeTotalAmountError();
    }
  }

  private canTransition(from: OrderStatus, to: OrderStatus): boolean {
    const map: Record<OrderStatus, OrderStatus[]> = {
      pending: [ORDER_STATUS_VALUE.CONFIRMED, ORDER_STATUS_VALUE.CANCELLED],
      confirmed: [ORDER_STATUS_VALUE.SHIPPING, ORDER_STATUS_VALUE.CANCELLED],
      shipping: [ORDER_STATUS_VALUE.DELIVERED],
      delivered: [ORDER_STATUS_VALUE.CANCELLED, ORDER_STATUS_VALUE.REVIEWED],
      reviewed: [],
      cancelled: [],
    };

    return map[from].includes(to);
  }

  addItem(item: OrderItem) {
    this.items.push(item);
    this.recalculateTotal();
  }

  changeStatus(newStatus: OrderStatus, note?: string) {
    if (
      this.status !== ORDER_STATUS_VALUE.PENDING &&
      newStatus !== ORDER_STATUS_VALUE.PENDING &&
      !this.canTransition(this.status, newStatus)
    ) {
      throw new InvalidStatusError();
    }

    this.histories.push(
      OrderStatusHistory.create({
        oldStatus: this.status,
        newStatus,
        note,
        orderId: this.id!, // dùng cho persistence/log
      })
    );

    this.status = newStatus;
  }

  markAsPaid(params?: { transactionCode?: string }) {
    if (this.isPaid) {
      throw new BadRequestError('Already paid');
    }

    if (
      this.paymentMethod === PAYMENT_METHOD_VALUE.VNPAY_WALLET ||
      this.paymentMethod === PAYMENT_METHOD_VALUE.MOMO_WALLET ||
      this.paymentMethod === PAYMENT_METHOD_VALUE.ZALOPAY_WALLET
    ) {
      if (!params?.transactionCode) {
        throw new MissingBankTransferTransactionCodeError();
      }

      this.bankTransferTransactionCode = params.transactionCode;
      this.bankTransferTime = new Date();
    }

    this.isPaid = true;
  }

  getId(): number | null {
    return this.id;
  }

  getStatus(): OrderStatus {
    return this.status;
  }

  getOrderDate(): Date {
    return this.orderDate;
  }

  getTotalProductAmount(): number {
    return this.totalProductAmount;
  }

  getShippingFee(): number {
    return this.shippingFee;
  }

  getDiscountAmount(): number {
    return this.discountAmount;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getIsPaid(): boolean {
    return this.isPaid;
  }

  getPaymentMethod(): PaymentMethod {
    return this.paymentMethod;
  }

  getBankTransferTime(): Date | null {
    return this.bankTransferTime;
  }

  getBankTransferTransactionCode(): string | null {
    return this.bankTransferTransactionCode;
  }

  getNote(): string | null {
    return this.note;
  }

  getAccountId(): number {
    return this.accountId;
  }

  getShippingInfoId(): number {
    return this.shippingInfoId;
  }

  getDiscountCodeId(): number | null {
    return this.discountCodeId;
  }
}

export class OrderItem {
  private constructor(
    private id: number | null,
    private productNameSnapshot: string,
    private variantNameSnapshot: string,
    private priceBeforeDiscount: number,
    private priceAfterDiscount: number,
    private quantity: number,
    private totalAmount: number,
    private orderId: number,
    private variantId: number
  ) {}

  static create(params: {
    productNameSnapshot: string;
    variantNameSnapshot: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    quantity: number;
    orderId: number;
    variantId: number;
  }): OrderItem {
    if (params.quantity <= 0) {
      throw new GreaterThanOrEqualZeroQuantityError();
    }
    if (params.orderId === null) {
      throw new MissingOrderIdError();
    }
    if (isNaN(params.orderId) || typeof params.orderId !== 'number') {
      throw new InvalidOrderIdError();
    }
    if (params.variantId === null) {
      throw new MissingVariantIdError();
    }
    if (isNaN(params.variantId) || typeof params.variantId !== 'number') {
      throw new InvalidVariantIdError();
    }

    const totalAmount = params.priceAfterDiscount * params.quantity;

    return new OrderItem(
      null,
      params.productNameSnapshot,
      params.variantNameSnapshot,
      params.priceBeforeDiscount,
      params.priceAfterDiscount,
      params.quantity,
      totalAmount,
      params.orderId,
      params.variantId
    );
  }

  static rehydrate(params: {
    id: number;
    productNameSnapshot: string;
    variantNameSnapshot: string;
    priceBeforeDiscount: number;
    priceAfterDiscount: number;
    quantity: number;
    totalAmount: number;
    orderId: number;
    variantId: number;
  }): OrderItem {
    return new OrderItem(
      params.id,
      params.productNameSnapshot,
      params.variantNameSnapshot,
      params.priceBeforeDiscount,
      params.priceAfterDiscount,
      params.quantity,
      params.totalAmount,
      params.orderId,
      params.variantId
    );
  }

  getId(): number | null {
    return this.id;
  }

  getProductNameSnapshot(): string {
    return this.productNameSnapshot;
  }

  getVariantNameSnapshot(): string {
    return this.variantNameSnapshot;
  }

  getPriceBeforeDiscount(): number {
    return this.priceBeforeDiscount;
  }

  getPriceAfterDiscount(): number {
    return this.priceAfterDiscount;
  }

  getQuantity(): number {
    return this.quantity;
  }

  getTotalAmount(): number {
    return this.totalAmount;
  }

  getOrderId(): number {
    return this.orderId;
  }

  getVariantId(): number {
    return this.variantId;
  }
}

export class OrderStatusHistory {
  private constructor(
    private id: number | null,
    private note: string | null,
    private changedAt: Date,
    private oldStatus: string,
    private newStatus: string,
    private orderId: number
  ) {}

  static create(params: {
    note?: string;
    oldStatus: string;
    newStatus: string;
    orderId: number;
  }): OrderStatusHistory {
    if (params.orderId === null) {
      throw new MissingOrderIdError();
    }
    if (isNaN(params.orderId) || typeof params.orderId !== 'number') {
      throw new InvalidOrderIdError();
    }

    return new OrderStatusHistory(
      null,
      params.note?.trim() || null,
      new Date(),
      params.oldStatus,
      params.newStatus,
      params.orderId
    );
  }

  static rehydrate(params: {
    id: number;
    note: string | null;
    changedAt: Date;
    oldStatus: string;
    newStatus: string;
    orderId: number;
  }): OrderStatusHistory {
    return new OrderStatusHistory(
      params.id,
      params.note,
      params.changedAt,
      params.oldStatus,
      params.newStatus,
      params.orderId
    );
  }

  getId(): number | null {
    return this.id;
  }

  getNote(): string | null {
    return this.note;
  }

  getChangedAt(): Date {
    return this.changedAt;
  }

  getOldStatus(): string {
    return this.oldStatus;
  }

  getNewStatus(): string {
    return this.newStatus;
  }

  getOrderId(): number {
    return this.orderId;
  }
}
