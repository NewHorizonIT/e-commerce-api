import { AppError } from '@/shared/error/error';

/**
 * Application layer errors - use case violations
 */

export class ReviewNotFoundError extends AppError {
  constructor(reviewId: number) {
    super(
      `Review with id ${reviewId} not found`,
      'REVIEW_NOT_FOUND',
      404
    );
  }
}

export class ReviewAlreadyExistsError extends AppError {
  constructor() {
    super(
      'Review for this product and order already exists',
      'REVIEW_ALREADY_EXISTS',
      409
    );
  }
}

export class ReviewNotAllowedError extends AppError {
  constructor() {
    super(
      'You can only review after the order is delivered',
      'REVIEW_NOT_ALLOWED',
      403
    );
  }
}

export class ReviewUpdateNotAllowedError extends AppError {
  constructor() {
    super(
      'Review can only be updated within 7 days of creation',
      'REVIEW_UPDATE_NOT_ALLOWED',
      403
    );
  }
}
