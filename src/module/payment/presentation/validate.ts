import { z } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '@/shared/error/error';

// ==================== VALIDATION SCHEMAS ====================

export const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: z.number().positive('Order ID must be positive'),
    gateway: z.enum(['vnpay', 'momo', 'zalopay']),
    method: z.enum(['card', 'wallet', 'bank_transfer']),
    amount: z.number().positive('Amount must be positive'),
    successUrl: z.string().url().optional(),
    cancelUrl: z.string().url().optional(),
  }),
});

export const paymentCallbackSchema = z.object({
  body: z.object({
    gateway: z.enum(['vnpay', 'momo', 'zalopay']),
    transactionRef: z.string().min(1),
    gatewayTransactionId: z.string().min(1),
    status: z.enum(['pending', 'processing', 'completed', 'failed', 'cancelled']),
    responseCode: z.string(),
    message: z.string(),
    metadata: z.record(z.string(), z.unknown()).optional(),
  }),
});

export const paymentStatusParamSchema = z.object({
  params: z.object({
    transactionRef: z.string().min(1),
  }),
});

export const paymentHistoryParamSchema = z.object({
  params: z.object({
    transactionRef: z.string().min(1),
  }),
});

// ==================== VALIDATION MIDDLEWARE ====================

export function validateRequest(schemas: Record<string, z.ZodSchema>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const toValidate: Record<string, unknown> = {};

      if (schemas.body) {
        toValidate.body = req.body;
      }

      if (schemas.params) {
        toValidate.params = req.params;
      }

      if (schemas.query) {
        toValidate.query = req.query;
      }

      const schema = z.object(schemas);
      schema.parse(toValidate);

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.issues
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');
        throw new BadRequestError(message);
      }
      throw error;
    }
  };
}
