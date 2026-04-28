import type { RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

const commonIdSchema = z.coerce.number().int().positive();

//schema param
export const removeItemParamSchema = z.object({
  variantId: commonIdSchema
});

export const updateQuantityParamSchema = z.object({
  variantId: commonIdSchema
});

//schema body
export const addCartItemSchema = z.object({
  quantity: z.coerce.number().int().positive().max(50),
  variantId: commonIdSchema
});

export const updateQuantitySchema = z.object({
  quantity: z.coerce.number().int().positive().max(50),
});

type SchemaMap = {
  body?: z.ZodTypeAny;
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
