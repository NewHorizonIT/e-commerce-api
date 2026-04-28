import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DISCOUNT_TYPE_VALUE } from '../domain/value_objects';

@Entity('discount_codes')
export class DiscountCodeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, name: 'discount_code', unique: true })
  discountCode!: string;

  @Column({
    type: 'enum',
    enum: [DISCOUNT_TYPE_VALUE.FIXED, DISCOUNT_TYPE_VALUE.PERCENTAGE],
  })
  type!: string;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'discount_value' })
  discountValue!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'minimum_order_value', default: 0 })
  minimumOrderValue!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3, name: 'maximum_discount' })
  maximumDiscount!: number;

  @Column({ type: 'int', name: 'maximum_usage' })
  maximumUsage!: number;

  @Column({ type: 'timestamp', name: 'start_time' })
  startTime!: Date;

  @Column({ type: 'timestamp', name: 'end_time' })
  endTime!: Date;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ type: 'boolean', name: 'allow_save_before', default: true })
  allowSaveBefore!: boolean;

  @Column({ type: 'timestamp', name: 'created_at', default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @Column({ type: 'timestamp', name: 'updated_at', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
