import type { Request, RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

const paginationSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const listProductsQuerySchema = paginationSchema.extend({
  q: z.string().trim().min(1).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  productTypeId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  sortBy: z.enum(['createdDate', 'price', 'sold']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  isHidden: z.coerce.boolean().optional(),
});

export const idParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
});

export const variantParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
  variantId: z.coerce.number().int().positive(),
});

export const groupParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
  groupId: z.coerce.number().int().positive(),
});

export const valueParamSchema = z.object({
  productId: z.coerce.number().int().positive(),
  groupId: z.coerce.number().int().positive(),
  valueId: z.coerce.number().int().positive(),
});

export const categoryParamSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
});

export const productTypeParamSchema = z.object({
  productTypeId: z.coerce.number().int().positive(),
});

export const variantStockParamSchema = z.object({
  variantId: z.coerce.number().int().positive(),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(255),
  description: z.string().trim().max(255).optional(),
  totalSold: z.number().int().nonnegative().optional(),
  hasVariant: z.boolean().optional(),
  isHidden: z.boolean().optional(),
  categoryId: z.number().int().positive(),
  productTypeId: z.number().int().positive(),
});

export const updateProductSchema = createProductSchema.partial();

export const updateVisibilitySchema = z.object({
  isHidden: z.boolean(),
});

export const deleteProductQuerySchema = z.object({
  mode: z.enum(['soft', 'hard']).optional(),
});

export const createVariantSchema = z.object({
  price: z.number().nonnegative(),
  stockQuantity: z.number().int().nonnegative(),
  isDefault: z.boolean().optional(),
  imageUrl: z.string().trim().url().optional(),
  variantValueIds: z.array(z.number().int().positive()).optional(),
});

export const updateVariantSchema = createVariantSchema.partial();

export const updateVariantStockSchema = z
  .object({
    stockQuantity: z.number().int().nonnegative().optional(),
    adjustment: z.number().int().optional(),
    reason: z.string().trim().max(255).optional(),
  })
  .refine((value) => value.stockQuantity !== undefined || value.adjustment !== undefined, {
    message: 'Either stockQuantity or adjustment is required',
  });

export const createNamedResourceSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const createVariantGroupSchema = z.object({
  name: z.string().trim().min(1).max(255),
  displayOrder: z.number().int().nonnegative().optional(),
});

export const updateVariantGroupSchema = createVariantGroupSchema.partial();

export const createVariantValueSchema = z.object({
  value: z.string().trim().min(1).max(255),
  imageUrl: z.string().trim().url().optional(),
});

export const updateVariantValueSchema = createVariantValueSchema.partial();

export const updateNamedResourceSchema = createNamedResourceSchema;

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
