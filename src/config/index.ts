/**
 * Configuration module exports
 * Centralizes all configuration exports for clean imports
 */

// Environment utilities
export {
  loadEnvFile,
  getEnv,
  getEnvNumber,
  getEnvBoolean,
  getEnvRequired,
  getEnvArray,
  isProduction,
  isDevelopment,
  isTest,
  isStaging,
  type NodeEnv,
} from './env';

// Application configuration
export { config, type Config } from './config';

// Database configuration
export { AppDataSource, databaseConnection, type IDatabaseConnection } from './database';

// Redis configuration
export { redisClient, type ICacheClient, type IJsonCacheClient } from './redis';
