import type { RequestHandler } from 'express';
import { z } from 'zod';
import { BadRequestError } from '@/shared/error/error';

const phoneNumberSchema = z
  .string()
  .trim()
  .regex(/^\d{10,15}$/, 'Phone number must contain 10-15 digits');

export const registerSchema = z.object({
  phoneNum: phoneNumberSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[a-zA-Z]/, 'Password must include at least one letter'),
});

export const loginSchema = z.object({
  phoneNum: phoneNumberSchema,
  password: z.string().min(1, 'Password is required'),
});

export function validateBody<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(new BadRequestError('Request body validation failed', result.error.flatten()));
    }

    req.body = result.data;
    return next();
  };
}

export function validateQuery<T>(schema: z.ZodType<T>): RequestHandler {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return next(new BadRequestError('Request query validation failed', result.error.flatten()));
    }

    (req as any).validatedQuery = result.data;
    return next();
  };
}

export const requireRefreshTokenCookie: RequestHandler = (req, _res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return next(new BadRequestError('Refresh token cookie is required'));
  }

  return next();
};

export const lockUnlockSchema = z.object({
  accountId: z.number().int().positive('accountId must be a positive integer'),
  isLocked: z.boolean(),
});

export const resetPasswordSchema = z.object({
  accountId: z.number().int().positive('accountId must be a positive integer'),
});

export const updateAccountSchema = z.object({
  accountId: z.number().int().positive('accountId must be a positive integer'),
  phoneNum: phoneNumberSchema.optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/\d/, 'Password must include at least one number')
    .regex(/[a-zA-Z]/, 'Password must include at least one letter')
    .optional(),
  role: z.enum(['admin', 'user']).optional(),
});
