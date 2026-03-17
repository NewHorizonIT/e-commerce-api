// Define Error Logger

import { baseLogger } from './logger';

export const ErrorLogger = {
  error: (message: string, code: string, meta?: Record<string, unknown>) => {
    baseLogger.error(message, { code, ...meta });
  },
};
