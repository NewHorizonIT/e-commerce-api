import { z } from 'zod';
import { PromotionStatusEnum, PromotionTypeEnum } from '../domain/value_objects';
import { RequestHandler } from 'express';
import { BadRequestError } from '@/shared/error/error';


export const commonIdSchema = z.coerce.number();

const promotionStatusEnum = z.enum(PromotionStatusEnum);
const promotionTypeEnum = z.enum(PromotionTypeEnum);

const promotionDetailSchema = z.object({
    id: z.number().positive().optional(),
    type: promotionTypeEnum,
    promotionValue: z.number().positive('Value must be greater than 0'),
    productLimit: z.number().int().nonnegative(),
    usageLimitPerCustomer: z.number().int().positive(),
    variantId: z.number().int().positive(),
});

export const createPromotionSchema = z.object({
    name: z.string(),
    startTime: z.string().datetime({ message: 'Invalid start time format (ISO 8601)' }),
    endTime: z.string().datetime({ message: 'Invalid end time format (ISO 8601)' }),
}).refine((data) => {
    return new Date(data.startTime) < new Date(data.endTime);
}, {
    message: "End time must be after start time",
    path: ["endTime"],
}).refine((data) => {
    return new Date() < new Date(data.startTime);
}, {
    message: "Start time must be after now",
    path: ["startTime"],
});

export const updatePromotionSchema = z.object({
    name: z.string().trim().min(5).optional(),
    startTime: z.string().datetime().optional(),
    endTime: z.string().datetime().optional(),
    status: promotionStatusEnum.optional(),
    details: z.array(promotionDetailSchema).optional(),
}).refine((data) => {
    if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
    }
    return true;
}, {
    message: "End time must be after start time",
    path: ["endTime"],
});

export const promotionIdParamSchema = z.object({
  id: commonIdSchema
});

export const removeDetailParamSchema = z.object({
  id: commonIdSchema,
  variantId: commonIdSchema
});


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