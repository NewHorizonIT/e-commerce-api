import type { RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

const statsRangeSchema = z
  .object({
    from: z.coerce.date().optional(),
    to: z.coerce.date().optional(),
    groupBy: z.enum(['day', 'week', 'month']).optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    productId: z.coerce.number().int().positive().optional(),
  })
  .refine((value) => !value.from || !value.to || value.from <= value.to, {
    message: '`from` must be less than or equal to `to`',
  });

type SchemaMap = {
  query?: z.ZodTypeAny;
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
      if (schemaMap.query) {
        const parsedQuery = schemaMap.query.parse(req.query) as Record<string, unknown>;
        replaceObjectValues(req.query as unknown as Record<string, unknown>, parsedQuery);
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

export { statsRangeSchema };
