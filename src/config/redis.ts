import Redis, { RedisOptions } from 'ioredis';
import { config } from './config';

/**
 * Redis client configuration
 * Following Single Responsibility Principle - only handles Redis connection
 */

// Redis connection options
const redisOptions: RedisOptions = {
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password || undefined,
  db: config.redis.db,
  keyPrefix: config.redis.keyPrefix,
  retryStrategy: (times: number) => {
    if (times > 3) {
      console.error('[Redis] Max retry attempts reached');
      return null;
    }
    const delay = Math.min(times * 200, 2000);
    console.log(`[Redis] Retrying connection in ${delay}ms...`);
    return delay;
  },
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  lazyConnect: true,
};

/**
 * Redis cache interface
 * Following Interface Segregation Principle
 */
export interface ICacheClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  get(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  expire(key: string, ttlSeconds: number): Promise<void>;
  ttl(key: string): Promise<number>;
  keys(pattern: string): Promise<string[]>;
  flushdb(): Promise<void>;
  getClient(): Redis;
}

/**
 * JSON Cache interface for storing objects
 * Following Interface Segregation Principle
 */
export interface IJsonCacheClient {
  getJson<T>(key: string): Promise<T | null>;
  setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}

/**
 * Redis cache implementation
 * Following Single Responsibility and Dependency Inversion Principles
 */
class RedisClient implements ICacheClient, IJsonCacheClient {
  private client: Redis;
  private connected: boolean = false;

  constructor(options: RedisOptions) {
    this.client = new Redis(options);
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.client.on('connect', () => {
      console.log('[Redis] Connecting...');
    });

    this.client.on('ready', () => {
      this.connected = true;
      console.log('[Redis] Connected successfully');
      console.log(`[Redis] Host: ${config.redis.host}:${config.redis.port}`);
    });

    this.client.on('error', (error) => {
      console.error('[Redis] Error:', error.message);
    });

    this.client.on('close', () => {
      this.connected = false;
      console.log('[Redis] Connection closed');
    });

    this.client.on('reconnecting', () => {
      console.log('[Redis] Reconnecting...');
    });
  }

  async connect(): Promise<void> {
    if (this.connected) {
      console.log('[Redis] Already connected');
      return;
    }

    try {
      await this.client.connect();
    } catch (error) {
      // If already connected, ignore the error
      if ((error as Error).message?.includes('already')) {
        this.connected = true;
        return;
      }
      console.error('[Redis] Connection failed:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connected) {
      console.log('[Redis] Not connected');
      return;
    }

    try {
      await this.client.quit();
      this.connected = false;
      console.log('[Redis] Disconnected successfully');
    } catch (error) {
      console.error('[Redis] Disconnect failed:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected && this.client.status === 'ready';
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushdb(): Promise<void> {
    await this.client.flushdb();
  }

  // JSON methods
  async getJson<T>(key: string): Promise<T | null> {
    const value = await this.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return null;
    }
  }

  async setJson<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const jsonValue = JSON.stringify(value);
    await this.set(key, jsonValue, ttlSeconds);
  }

  getClient(): Redis {
    return this.client;
  }
}

// Export singleton instance
export const redisClient = new RedisClient(redisOptions);

export default redisClient;
