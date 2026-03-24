import type { ErrorRequestHandler } from 'express';
import { config } from '@config/config';
import { AppError, InternalServerError } from '../error/error';
import { ErrorLogger } from '../logging/errorLogger';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // Delegate to default Express handler when headers are already sent.
  if (res.headersSent) {
    return next(err);
  }
  console.error('Unhandled error:', err);

  const requestIdHeader = req.headers['x-request-id'];
  const localRequestId =
    typeof res.locals?.requestId === 'string' ? (res.locals.requestId as string) : undefined;
  const traceId = Array.isArray(requestIdHeader)
    ? requestIdHeader[0]
    : requestIdHeader || localRequestId || 'unknown';
  const normalizedError =
    err instanceof AppError
      ? err
      : new InternalServerError('Internal Server Error', undefined, err);

  ErrorLogger.error(normalizedError.message, normalizedError.code, {
    method: req.method,
    path: req.originalUrl,
    statusCode: normalizedError.statusCode,
    traceId,
    stack: normalizedError.stack,
    cause: normalizedError.cause,
    details: normalizedError.details,
  });

  const payload: Record<string, unknown> = {
    status: 'error',
    code: normalizedError.code,
    message: normalizedError.message,
    traceId,
  };

  if (config.app.env !== 'production' && normalizedError.details !== undefined) {
    payload.details = normalizedError.details;
  }

  return res.status(normalizedError.statusCode).json(payload);
};

export default errorHandler;
