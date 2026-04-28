import { AppError } from '@/shared/error/error';

/**
 * Domain layer errors - business rule violations
 * These errors should be thrown when domain invariants are violated
 */

export class InvalidRatingValueError extends AppError {
  constructor(rating: number) {
    super(
      `Rating must be an integer between 1 and 5, got: ${rating}`,
      'INVALID_RATING_VALUE',
      400
    );
  }
}

export class InvalidReviewContentError extends AppError {
  constructor(reason: string) {
    super(
      `Review content is invalid: ${reason}`,
      'INVALID_REVIEW_CONTENT',
      400
    );
  }
}
