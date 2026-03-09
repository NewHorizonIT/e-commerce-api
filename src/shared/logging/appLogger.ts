import { baseLogger } from './logger';

export const appLogger = {
  info: (message: string, meta?: any) => baseLogger.info(message, meta),
  warn: (message: string, meta?: any) => baseLogger.warn(message, meta),
};
