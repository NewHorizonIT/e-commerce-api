# TypeORM Reference

Quick reference for TypeORM patterns used in this project.

## Entity Decorators

```typescript
import {
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Index,
} from 'typeorm';
```

## Common Column Types

```typescript
@Column()                          // varchar(255)
@Column('text')                    // text
@Column('int')                     // integer
@Column('decimal', { precision: 10, scale: 2 }) // decimal
@Column('boolean', { default: false })
@Column({ type: 'enum', enum: OrderStatus })
@Column({ nullable: true })
@Column({ unique: true })
@Column({ name: 'column_name' })   // custom column name
```

## Relationships

### One-to-Many / Many-to-One

```typescript
// Product belongs to Category
@Entity('products')
export class ProductModel {
  @ManyToOne(() => CategoryModel, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category!: CategoryModel;
}

// Category has many Products
@Entity('categories')
export class CategoryModel {
  @OneToMany(() => ProductModel, (product) => product.category)
  products!: ProductModel[];
}
```

### Many-to-Many

```typescript
@Entity('orders')
export class OrderModel {
  @ManyToMany(() => ProductModel)
  @JoinTable({
    name: 'order_products',
    joinColumn: { name: 'order_id' },
    inverseJoinColumn: { name: 'product_id' },
  })
  products!: ProductModel[];
}
```

## Query Patterns

```typescript
// Find with relations
const order = await repository.findOne({
  where: { id },
  relations: ['items', 'items.product', 'user'],
});

// Find with conditions
const products = await repository.find({
  where: {
    price: LessThan(100),
    stock: MoreThan(0),
    category: { id: categoryId },
  },
  order: { createdAt: 'DESC' },
  take: 10,
  skip: 0,
});

// Query builder
const products = await repository
  .createQueryBuilder('product')
  .leftJoinAndSelect('product.category', 'category')
  .where('product.price < :price', { price: 100 })
  .andWhere('product.stock > 0')
  .orderBy('product.createdAt', 'DESC')
  .getMany();
```

## Transactions

```typescript
import { AppDataSource } from '@infrastructure/database/data-source';

async function createOrderWithItems(order: OrderEntity, items: OrderItemEntity[]): Promise<void> {
  await AppDataSource.transaction(async (manager) => {
    await manager.save(OrderModel, order);
    await manager.save(OrderItemModel, items);

    // Update product stock
    for (const item of items) {
      await manager.decrement(ProductModel, { id: item.productId }, 'stock', item.quantity);
    }
  });
}
```

## Migrations

```bash
# Generate migration from entity changes
npm run typeorm migration:generate -- -n CreateUsersTable

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

### Migration Example

```typescript
// src/infrastructure/database/migrations/1234567890-CreateUsersTable.ts
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true },
          { name: 'email', type: 'varchar', isUnique: true },
          { name: 'password', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'created_at', type: 'timestamp', default: 'now()' },
          { name: 'updated_at', type: 'timestamp', default: 'now()' },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
```
