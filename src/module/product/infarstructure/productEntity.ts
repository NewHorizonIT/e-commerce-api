import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products!: ProductEntity[];

  @OneToMany(() => CategoryDetailEntity, (detail) => detail.category)
  details!: CategoryDetailEntity[];
}

@Entity('product_types')
export class ProductTypeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @OneToMany(() => ProductEntity, (product) => product.productType)
  products!: ProductEntity[];
}

@Entity('attributes')
export class AttributeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({
    type: 'enum',
    enum: ['string', 'int', 'bool', 'decimal'],
    name: 'data_type',
  })
  dataType!: 'string' | 'int' | 'bool' | 'decimal';

  @OneToMany(() => ProductDetailEntity, (detail) => detail.attribute)
  productDetails!: ProductDetailEntity[];

  @OneToMany(() => CategoryDetailEntity, (detail) => detail.attribute)
  categoryDetails!: CategoryDetailEntity[];
}

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description!: string | null;

  @Column({ type: 'int', default: 0, name: 'total_sold' })
  totalSold!: number;

  @Column({ type: 'boolean', default: true, name: 'has_variant' })
  hasVariant!: boolean;

  @Column({ type: 'boolean', default: true, name: 'is_hidden' })
  isHidden!: boolean;

  @Column({ type: 'int', name: 'product_type_id' })
  productTypeId!: number;

  @Column({ type: 'int', name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => ProductTypeEntity, (productType) => productType.products)
  @JoinColumn({ name: 'product_type_id' })
  productType!: ProductTypeEntity;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;

  @OneToMany(() => VariantEntity, (variant) => variant.product)
  variants!: VariantEntity[];

  @OneToMany(() => VariantGroupEntity, (group) => group.product)
  variantGroups!: VariantGroupEntity[];

  @OneToMany(() => ProductDetailEntity, (detail) => detail.product)
  productDetails!: ProductDetailEntity[];
}

@Entity('category_details')
export class CategoryDetailEntity {
  @PrimaryColumn({ type: 'int', name: 'category_id' })
  categoryId!: number;

  @PrimaryColumn({ type: 'int', name: 'attribute_id' })
  attributeId!: number;

  @ManyToOne(() => CategoryEntity, (category) => category.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;

  @ManyToOne(() => AttributeEntity, (attribute) => attribute.categoryDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute!: AttributeEntity;
}

@Entity('product_details')
export class ProductDetailEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  value!: string;

  @Column({ type: 'int', name: 'product_id' })
  productId!: number;

  @Column({ type: 'int', name: 'attribute_id' })
  attributeId!: number;

  @ManyToOne(() => ProductEntity, (product) => product.productDetails, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @ManyToOne(() => AttributeEntity, (attribute) => attribute.productDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute!: AttributeEntity;
}

@Entity('media_files')
export class MediaFileEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  url!: string;

  @Column({
    type: 'enum',
    enum: ['image', 'video'],
    name: 'file_type',
  })
  fileType!: 'image' | 'video';

  @Column({ type: 'varchar', length: 255, name: 'entity_type' })
  entityType!: string;

  @Column({ type: 'int', name: 'entity_id' })
  entityId!: number;
}

@Entity('variants')
export class VariantEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'decimal', precision: 12, scale: 3 })
  price!: number;

  @Column({ type: 'int', name: 'stock_quantity' })
  stockQuantity!: number;

  @Column({ type: 'boolean', default: false, name: 'is_default' })
  isDefault!: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'image_url' })
  imageUrl!: string | null;

  @Column({ type: 'int', name: 'product_id' })
  productId!: number;

  @ManyToOne(() => ProductEntity, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @OneToMany(() => VariantDetailEntity, (detail) => detail.variant)
  details!: VariantDetailEntity[];
}

@Entity('variant_groups')
export class VariantGroupEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'int', default: 0, name: 'display_order' })
  displayOrder!: number;

  @Column({ type: 'int', name: 'product_id' })
  productId!: number;

  @ManyToOne(() => ProductEntity, (product) => product.variantGroups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product!: ProductEntity;

  @OneToMany(() => VariantValueEntity, (value) => value.group)
  values!: VariantValueEntity[];
}

@Entity('variant_values')
export class VariantValueEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  value!: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'image_url' })
  imageUrl!: string | null;

  @Column({ type: 'int', name: 'variant_group_id' })
  variantGroupId!: number;

  @ManyToOne(() => VariantGroupEntity, (group) => group.values, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_group_id' })
  group!: VariantGroupEntity;

  @OneToMany(() => VariantDetailEntity, (detail) => detail.value)
  details!: VariantDetailEntity[];
}

@Entity('variant_details')
export class VariantDetailEntity {
  @PrimaryColumn({ type: 'int', name: 'variant_id' })
  variantId!: number;

  @PrimaryColumn({ type: 'int', name: 'variant_value_id' })
  variantValueId!: number;

  @ManyToOne(() => VariantEntity, (variant) => variant.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant!: VariantEntity;

  @ManyToOne(() => VariantValueEntity, (value) => value.details, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_value_id' })
  value!: VariantValueEntity;
}
