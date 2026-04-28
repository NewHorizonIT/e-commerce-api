import type { Request, RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

// 🔹 Pagination (reuse giống product)
const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

// 🔹 Query list reviews
export const listReviewsQuerySchema = paginationSchema.extend({
  productId: z.coerce.number().int().positive().optional(),
});

// 🔹 Params
export const reviewIdParamSchema = z.object({
  reviewId: z.coerce.number().int().positive(),
});

export const productIdParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
});

// 🔹 Create review
export const createReviewSchema = z.object({
  productId: z.number().int().positive(),
  orderId: z.number().int().positive(),
  accountId: z.number().int().positive(),

  rating: z.number().int().min(1).max(5),
  content: z.string().trim().min(1).max(1000).optional(),
});

// 🔹 Update review
export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    content: z.string().trim().min(1).max(1000).optional(),
  })
  .refine(
    (value) => value.rating !== undefined || value.content !== undefined,
    {
      message: 'At least one field must be provided for update',
    }
  );

// 🔹 validateRequest (copy y chang product cho consistency)

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
