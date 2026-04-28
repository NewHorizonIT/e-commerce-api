import type { RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

const commonIdSchema = z.coerce.number().int().positive();

export const addressIdParamSchema = z.object({
  addressId: commonIdSchema,
});

export const upsertPersonalInformationSchema = z.object({
  name: z.string().trim().min(1).max(255),
  avatarUrl: z.string().trim().max(255).nullable().optional(),
  gender: z.boolean().nullable().optional(),
  birth: z.coerce.date().nullable().optional(),
});

export const createShippingAddressSchema = z.object({
  isDefault: z.boolean().optional(),
  streetAddress: z.string().trim().min(1).max(255),
  ward: z.string().trim().min(1).max(255),
  province: z.string().trim().min(1).max(255),
  receiverName: z.string().trim().min(1).max(255),
  receiverPhone: z
    .string()
    .trim()
    .regex(/^\d{10,15}$/, 'Receiver phone must contain 10-15 digits'),
});

export const updateShippingAddressSchema = z
  .object({
    isDefault: z.boolean().optional(),
    streetAddress: z.string().trim().min(1).max(255).optional(),
    ward: z.string().trim().min(1).max(255).optional(),
    province: z.string().trim().min(1).max(255).optional(),
    receiverName: z.string().trim().min(1).max(255).optional(),
    receiverPhone: z
      .string()
      .trim()
      .regex(/^\d{10,15}$/, 'Receiver phone must contain 10-15 digits')
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    'At least one field is required'
  );

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
