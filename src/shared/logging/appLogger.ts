import { baseLogger } from './logger';

export const appLogger = {
  debug: (message: string, meta?: Record<string, unknown>) => baseLogger.debug(message, meta),
  info: (message: string, meta?: Record<string, unknown>) => baseLogger.info(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => baseLogger.warn(message, meta),
  error: (message: string, meta?: Record<string, unknown>) => baseLogger.error(message, meta),
};
