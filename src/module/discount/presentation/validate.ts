import { z } from 'zod';
import { RequestHandler } from 'express';
import { DISCOUNT_TYPE_VALUE } from '../domain/value_objects';
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
        req.body = schemaMap.body.parse(req.body);
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

export const listDiscountsQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),

  isActive: z.coerce.boolean().optional(),

  sortBy: z.enum(['name', 'startTime', 'discountValue']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const discountIdParamSchema = z.object({
  discountId: z.coerce.number().int().positive(),
});

export const discountCodeParamSchema = z.object({
  code: z.string().trim().min(1),
});

export const createDiscountSchema = z.object({
  name: z.string().trim().min(1).max(255),
  discountCode: z.string().trim().min(1).max(255),

  type: z.nativeEnum(DISCOUNT_TYPE_VALUE),

  discountValue: z.coerce.number().positive(),

  minimumOrderValue: z.coerce.number().nonnegative().optional(),
  maximumDiscount: z.coerce.number().positive().optional(),
  maximumUsage: z.coerce.number().int().positive().optional(),

  startTime: z.coerce.date(),
  endTime: z.coerce.date(),

  isActive: z.coerce.boolean().optional(),
  allowSaveBefore: z.coerce.boolean().optional(),
});

export const updateDiscountSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
  discountCode: z.string().trim().min(1).max(255).optional(),

  type: z.nativeEnum(DISCOUNT_TYPE_VALUE).optional(),

  discountValue: z.coerce.number().positive().optional(),

  minimumOrderValue: z.coerce.number().nonnegative().optional(),
  maximumDiscount: z.coerce.number().positive().optional(),
  maximumUsage: z.coerce.number().int().positive().optional(),

  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),

  // isActive: z.coerce.boolean().optional(),
  allowSaveBefore: z.coerce.boolean().optional(),
});

export const updateActiveDiscountSchema = z.object({
  isActive: z.coerce.boolean(),
});

export const checkDiscountValiditySchema = z.object({
  discountCode: z.string().trim().min(1),
  orderAmount: z.coerce.number().positive(),
  currentDate: z.coerce.date().optional(),
});
