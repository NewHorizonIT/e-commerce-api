import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ORDER_STATUS_VALUE, PAYMENT_METHOD_VALUE } from '../domain/value_objects';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: [
      ORDER_STATUS_VALUE.PENDING,
      ORDER_STATUS_VALUE.CONFIRMED,
      ORDER_STATUS_VALUE.SHIPPING,
      ORDER_STATUS_VALUE.DELIVERED,
      ORDER_STATUS_VALUE.REVIEWED,
      ORDER_STATUS_VALUE.CANCELLED,
    ],
  })
  status!: string;

  @Column({ type: 'date', name: 'order_date' })
  orderDate!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'total_product_amount' })
  totalProductAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'shipping_fee' })
  shippingFee!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'discount_amount' })
  discountAmount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'total_amount' })
  totalAmount!: number;

  @Column({ type: 'boolean', name: 'is_paid' })
  isPaid!: boolean;

  @Column({
    type: 'enum',
    enum: [
      PAYMENT_METHOD_VALUE.CASH_ON_DELIVERY,
      PAYMENT_METHOD_VALUE.VNPAY_WALLET,
      PAYMENT_METHOD_VALUE.MOMO_WALLET,
      PAYMENT_METHOD_VALUE.ZALOPAY_WALLET,
    ],
    name: 'payment_method',
  })
  paymentMethod!: string;

  @Column({ type: 'timestamp', nullable: true, name: 'bank_transfer_time' })
  bankTransferTime!: Date | null;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'bank_transfer_transaction_code' })
  bankTransferTransactionCode!: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string | null;

  @Column({ type: 'int', name: 'account_id' })
  accountId!: number;

  @Column({ type: 'int', name: 'shipping_info_id' })
  shippingInfoId!: number;

  @Column({ type: 'int', nullable: true, name: 'discount_code_id' })
  discountCodeId!: number | null;

  @OneToMany(() => OrderItemEntity, (item) => item.order)
  items!: OrderItemEntity[];

  @OneToMany(() => OrderStatusHistoryEntity, (history) => history.order)
  histories!: OrderStatusHistoryEntity[];
}

@Entity('order_items')
export class OrderItemEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, name: 'product_name_snapshot' })
  productNameSnapshot!: string;

  @Column({ type: 'varchar', length: 255, name: 'variant_name_snapshot' })
  variantNameSnapshot!: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'price_before_discount' })
  priceBeforeDiscount!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'price_after_discount' })
  priceAfterDiscount!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'total_amount' })
  totalAmount!: number;

  @Column({ type: 'int', name: 'order_id' })
  orderId!: number;

  @Column({ type: 'int', name: 'variant_id' })
  variantId!: number;

  @ManyToOne(() => OrderEntity, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}

@Entity('order_status_histories')
export class OrderStatusHistoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  note!: string | null;

  @Column({ type: 'timestamp', name: 'changed_at' })
  changedAt!: Date;

  @Column({
    type: 'enum',
    enum: [
      ORDER_STATUS_VALUE.PENDING,
      ORDER_STATUS_VALUE.CONFIRMED,
      ORDER_STATUS_VALUE.SHIPPING,
      ORDER_STATUS_VALUE.DELIVERED,
      ORDER_STATUS_VALUE.REVIEWED,
      ORDER_STATUS_VALUE.CANCELLED,
    ],
    name: 'old_status',
  })
  oldStatus!: string | null;

  @Column({
    type: 'enum',
    enum: [
      ORDER_STATUS_VALUE.PENDING,
      ORDER_STATUS_VALUE.CONFIRMED,
      ORDER_STATUS_VALUE.SHIPPING,
      ORDER_STATUS_VALUE.DELIVERED,
      ORDER_STATUS_VALUE.REVIEWED,
      ORDER_STATUS_VALUE.CANCELLED,
    ],
    name: 'new_status',
  })
  newStatus!: string;

  @Column({ type: 'int', name: 'order_id' })
  orderId!: number;

  @ManyToOne(() => OrderEntity, (order) => order.histories)
  @JoinColumn({ name: 'order_id' })
  order!: OrderEntity;
}
