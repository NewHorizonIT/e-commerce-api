import {
  getEnv,
  getEnvArray,
  getEnvBoolean,
  getEnvNumber,
  isDevelopment,
  isProduction,
  loadEnvFile,
  NodeEnv,
} from './env';

// DEFINE CONFIG

loadEnvFile();

interface AppConfig {
  name: string;
  host: string;
  port: number;
  env: NodeEnv;
  isProduction: boolean;
  isDevelopment: boolean;
  apiPrefix: string;
  apiVersion: string;
}

interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
  synchronize: boolean;
  logging: boolean;
  maxConnections: number;
  connectionTimeout: number;
}

interface JwtConfig {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
}

interface RedisConfig {
  host: string;
  port: number;
  password: string;
  db: number;
  keyPrefix: string;
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
  methods: string[];
  allowedHeaders: string[];
  credentials: boolean;
}

export interface RateLimitConfig {
  enabled: boolean;
  windowMs: number;
  maxRequests: number;
  message: string;
}

export interface LogConfig {
  level: string;
  format: 'json' | 'simple';
  directory: string;
}

export interface Config {
  app: AppConfig;
  database: DatabaseConfig;
  jwt: JwtConfig;
  redis: RedisConfig;
  cors: CorsConfig;
  rateLimit: RateLimitConfig;
  log: LogConfig;
}

export const config: Config = {
  // APP
  app: {
    name: getEnv('APP_NAME', 'e-commerce-api'),
    host: getEnv('APP_HOST', 'localhost'),
    port: getEnvNumber('APP_PORT', 3000),
    env: getEnv('NODE_ENV', 'development') as NodeEnv,
    isProduction: isProduction(),
    isDevelopment: isDevelopment(),
    apiPrefix: getEnv('API_PREFIX', '/api'),
    apiVersion: getEnv('API_VERSION', 'v1'),
  },

  // DATABASE
  database: {
    host: getEnv('DB_HOST', 'localhost'),
    port: getEnvNumber('DB_PORT', 5432),
    username: getEnv('DB_USERNAME', 'postgres'),
    password: getEnv('DB_PASSWORD', ''),
    database: getEnv('DB_NAME', 'ecommerce_db'),
    ssl: getEnvBoolean('DB_SSL', false),
    synchronize: getEnvBoolean('DB_SYNC', false),
    logging: getEnvBoolean('DB_LOGGING', false),
    maxConnections: getEnvNumber('DB_MAX_CONNECTIONS', 10),
    connectionTimeout: getEnvNumber('DB_CONNECTION_TIMEOUT', 10000),
  },

  // JWT
  jwt: {
    accessToken: {
      secret: getEnv('JWT_ACCESS_TOKEN_SECRET', 'access-secret-change-me'),
      expiresIn: getEnv('JWT_ACCESS_TOKEN_EXPIRATION', '15m'),
    },
    refreshToken: {
      secret: getEnv('JWT_REFRESH_TOKEN_SECRET', 'refresh-secret-change-me'),
      expiresIn: getEnv('JWT_REFRESH_TOKEN_EXPIRATION', '7d'),
    },
  },

  // REDIS
  redis: {
    host: getEnv('REDIS_HOST', 'localhost'),
    port: getEnvNumber('REDIS_PORT', 6379),
    password: getEnv('REDIS_PASSWORD', ''),
    db: getEnvNumber('REDIS_DB', 0),
    keyPrefix: getEnv('REDIS_KEY_PREFIX', 'ecommerce:'),
  },

  // CORS
  cors: {
    enabled: getEnvBoolean('CORS_ENABLED', true),
    origins: getEnvArray('CORS_ORIGINS', ['http://localhost:3000', 'http://localhost:5173']),
    methods: getEnvArray('CORS_METHODS', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']),
    allowedHeaders: getEnvArray('CORS_ALLOWED_HEADERS', [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
    ]),
    credentials: getEnvBoolean('CORS_CREDENTIALS', true),
  },

  // RATE LIMITING
  rateLimit: {
    enabled: getEnvBoolean('RATE_LIMIT_ENABLED', true),
    windowMs: getEnvNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000), // 15 minutes
    maxRequests: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
    message: getEnv('RATE_LIMIT_MESSAGE', 'Too many requests, please try again later.'),
  },

  // LOGGING
  log: {
    level: getEnv('LOG_LEVEL', isDevelopment() ? 'debug' : 'info'),
    format: getEnv('LOG_FORMAT', 'json') as 'json' | 'simple',
    directory: getEnv('LOG_DIRECTORY', 'logs'),
  },
};

export default config;
