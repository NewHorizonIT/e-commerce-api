import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';

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

  // 🔹 Relationship to review media
  @OneToMany(() => ReviewMediaEntity, (media) => media.reviewId, { eager: false })
  media?: ReviewMediaEntity[];
}

// 🔹 ReviewMediaEntity - lưu ảnh/video cho review
@Entity('review_media')
export class ReviewMediaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int', name: 'review_id' })
  reviewId!: number;

  @Column({ type: 'varchar', length: 500 })
  url!: string;

  @Column({
    type: 'enum',
    enum: ['image', 'video'],
    name: 'file_type',
    default: 'image',
  })
  fileType!: 'image' | 'video';

  @Column({
    type: 'int',
    name: 'sort_order',
    default: 0,
  })
  sortOrder!: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    name: 'created_at',
  })
  createdAt!: Date;
}
