import dotenv from 'dotenv';
import path from 'path';

// ENVIRONMENT TYPE
export type NodeEnv = 'development' | 'production' | 'test' | 'staging';

// LOAD ENV FILES
export function loadEnvFile(): void {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const rootDir = process.cwd();

  const envFiles = [`.env.${nodeEnv}.local`, `.env.${nodeEnv}`, `.env.local`, `.env`];

  for (const envFile of envFiles) {
    const envPath = path.resolve(rootDir, envFile);
    const result = dotenv.config({ path: envPath });
    if (!result.error) {
      console.log(`Loaded env from: ${envFile}`);
    }
  }
}

// METHODS TO GET ENV VARIABLES
export function getEnv(key: string, fallback: string = ''): string {
  return process.env[key] ?? fallback;
}

export function getEnvNumber(key: string, fallback: number): number {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

export function getEnvBoolean(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value.toLowerCase() === 'true' || value === '1';
}

export function getEnvRequired(key: string): string {
  const value = process.env[key];
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getEnvArray(key: string, fallback: string[] = []): string[] {
  const value = process.env[key];
  if (value === undefined || value === '') {
    return fallback;
  }
  return value.split(',').map((item) => item.trim());
}

// METHODS TO CHECK ENVIRONMENT
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

export function isTest(): boolean {
  return process.env.NODE_ENV === 'test';
}

export function isStaging(): boolean {
  return process.env.NODE_ENV === 'staging';
}
