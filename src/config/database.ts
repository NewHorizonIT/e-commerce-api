import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './config.js';
import { AccountEntity } from '@/module/auth/infarstructure/accountEntity.js';
import {
  CategoryEntity,
  ProductEntity,
  ProductTypeEntity,
  VariantDetailEntity,
  VariantEntity,
  VariantGroupEntity,
  VariantValueEntity,
} from '@/module/product/infarstructure/productEntity.js';
import { ReviewEntity } from '@/module/review/infrastructure/reviewEntity.js';
import {
  OrderEntity,
  OrderItemEntity,
  OrderStatusHistoryEntity,
} from '@/module/order/infrastructure/order-entity';
import { DiscountCodeEntity } from '@/module/discount/infrastructure/discount-entity';
import { CartEntity, CartItemDetailEntity } from '@/module/cart/infrastructure/cartEntity';
import {
  PersonalInformationEntity,
  ShippingAddressEntity,
} from '@/module/user/infrastructure/userEntity';

// TypeORM DataSource Options
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // 🔥 QUAN TRỌNG
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,

  synchronize: config.database.synchronize,
  logging: config.database.logging,
  entities: [
    AccountEntity,
    CategoryEntity,
    ProductTypeEntity,
    ProductEntity,
    VariantEntity,
    VariantGroupEntity,
    VariantValueEntity,
    VariantDetailEntity,
    DiscountCodeEntity,
    OrderEntity,
    OrderItemEntity,
    OrderStatusHistoryEntity,
    ReviewEntity,
    CartItemDetailEntity,
    CartEntity,
    PersonalInformationEntity,
    ShippingAddressEntity,
  ],
  migrations: ['src/shared/infrastructure/database/migrations/**/*.{ts,js}'],
  subscribers: ['src/shared/infrastructure/database/subscribers/**/*.{ts,js}'],
};

export const AppDataSource = new DataSource(dataSourceOptions);

export interface IDatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getDataSource(): DataSource;
}

class DatabaseConnection implements IDatabaseConnection {
  private dataSource: DataSource;
  private connected: boolean = false;

  constructor(dataSource: DataSource) {
    this.dataSource = dataSource;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      console.log('[Database] Already connected');
      return;
    }

    try {
      await this.dataSource.initialize();
      this.connected = true;
      console.log('[Database] PostgreSQL connected successfully');
      console.log(`[Database] Host: ${config.database.host}:${config.database.port}`);
      console.log(`[Database] Database: ${config.database.database}`);
    } catch (error) {
      this.connected = false;
      console.error('[Database] Connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      console.log('[Database] Not connected');
      return;
    }

    try {
      await this.dataSource.destroy();
      this.connected = false;
      console.log('[Database] Disconnected successfully');
    } catch (error) {
      console.error('[Database] Disconnect failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected && this.dataSource.isInitialized;
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}

export const databaseConnection = new DatabaseConnection(AppDataSource);

export default databaseConnection;
