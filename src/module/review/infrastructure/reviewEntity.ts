import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity('reviews')
@Unique(['accountId', 'productId', 'orderId'])
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'product_id' })
  productId!: number;

  @Column({ type: 'int', name: 'account_id' })
  accountId!: number;

  @Column({ type: 'int', name: 'order_id' })
  orderId!: number;

  @Column({ type: 'int' })
  rating!: number;

  @Column({ type: 'text', nullable: true })
  content!: string | null;

  @Column({ type: 'int', nullable: true, name: 'seller_rating' })
  sellerRating!: number | null;

  @Column({ type: 'int', nullable: true, name: 'shipping_rating' })
  shippingRating!: number | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;
}
