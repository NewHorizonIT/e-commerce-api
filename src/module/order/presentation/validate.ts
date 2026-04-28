import { z } from 'zod';
import { RequestHandler } from 'express';
import { ORDER_STATUS_VALUE, PAYMENT_METHOD_VALUE } from '../domain/value_objects';
import { BadRequestError } from '@/shared/error/error';

type SchemaMap = {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
};

function replaceObjectValues(
  target: Record<string, unknown>,
  source: Record<string, unknown>
): void {
  for (const key of Object.keys(target)) {
    delete target[key];
  }

  Object.assign(target, source);
}

export function validateRequest(schemaMap: SchemaMap): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemaMap.params) {
        const parsedParams = schemaMap.params.parse(req.params) as Record<string, unknown>;
        replaceObjectValues(req.params as unknown as Record<string, unknown>, parsedParams);
      }

      if (schemaMap.query) {
        const parsedQuery = schemaMap.query.parse(req.query) as Record<string, unknown>;
        replaceObjectValues(req.query as unknown as Record<string, unknown>, parsedQuery);
      }

      if (schemaMap.body) {
        req.body = schemaMap.body.parse(req.body) as Request['body'];
      }

      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(new BadRequestError('Request validation failed', error.flatten()));
      }

      return next(error);
    }
  };
}

export const listOrdersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),

  accountId: z.coerce.number().int().positive().optional(),
  shippingInfoId: z.coerce.number().int().positive().optional(),
  discountCodeId: z.coerce.number().int().positive().optional(),

  status: z.nativeEnum(ORDER_STATUS_VALUE).optional(),

  sortBy: z.enum(['orderDate', 'totalAmount']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const orderIdParamSchema = z.object({
  orderId: z.coerce.number().int().positive(),
});

export const accountIdParamSchema = z.object({
  accountId: z.coerce.number().int().positive(),
});

export const shippingInfoIdParamSchema = z.object({
  shippingInfoId: z.coerce.number().int().positive(),
});

export const discountCodeIdParamSchema = z.object({
  discountCodeId: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
  shippingFee: z.coerce.number().nonnegative().optional(),
  discountAmount: z.coerce.number().nonnegative().optional(),

  paymentMethod: z.nativeEnum(PAYMENT_METHOD_VALUE),

  note: z.string().trim().max(255).optional(),

  accountId: z.coerce.number().int().positive().optional(),
  shippingInfoId: z.coerce.number().int().positive(),
  discountCodeId: z.coerce.number().int().positive().optional(),

  items: z.array(
    z.object({
      variantId: z.coerce.number().int().positive(),
      quantity: z.coerce.number().int().positive(),
    })
  ),
});

export const updateOrderPaymentSchema = z.object({
  isPaid: z.boolean(),
  paymentMethod: z.nativeEnum(PAYMENT_METHOD_VALUE),
  bankTransferTime: z.coerce.date().optional().nullable(),
  bankTransferTransactionCode: z.string().trim().max(255).optional().nullable(),
});

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS_VALUE),
  note: z.string().trim().max(255).optional(),
});
