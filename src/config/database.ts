import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from './config';
import { AccountEntity } from '@/module/auth/infarstructure/accountEntity';

// TypeORM DataSource Options
const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  ssl: config.database.ssl ? { rejectUnauthorized: false } : false,
  synchronize: config.database.synchronize,
  logging: config.database.logging,
  poolSize: config.database.maxConnections,
  connectTimeoutMS: config.database.connectionTimeout,
  entities: [AccountEntity],
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
