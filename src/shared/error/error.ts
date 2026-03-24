// Define app-level error classes used across the API.
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly cause?: unknown;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    code: string,
    statusCode = 400,
    cause?: unknown,
    details?: unknown,
    isOperational = true
  ) {
    super(message);

    this.name = new.target.name;
    this.code = code;
    this.statusCode = statusCode;
    this.cause = cause;
    this.details = details;
    this.isOperational = isOperational;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, new.target);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad request', details?: unknown, cause?: unknown) {
    super(message, 'BAD_REQUEST', 400, cause, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized', details?: unknown, cause?: unknown) {
    super(message, 'UNAUTHORIZED', 401, cause, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden', details?: unknown, cause?: unknown) {
    super(message, 'FORBIDDEN', 403, cause, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found', details?: unknown, cause?: unknown) {
    super(message, 'NOT_FOUND', 404, cause, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal Server Error', details?: unknown, cause?: unknown) {
    super(message, 'INTERNAL_SERVER_ERROR', 500, cause, details, false);
  }
}
