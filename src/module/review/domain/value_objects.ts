import { InvalidRatingValueError, InvalidReviewContentError } from './errors';

/**
 * 🔹 RatingValue - Value Object for rating (1-5)
 */
export class RatingValue {
  constructor(readonly value: number) {
    if (!Number.isInteger(value) || value < 1 || value > 5) {
      throw new InvalidRatingValueError(value);
    }
  }
}

/**
 * 🔹 ReviewContent - Value Object for review text content
 */
export class ReviewContent {
  constructor(readonly value: string | null) {
    if (value === null) {
      return;
    }

    const trimmed = value.trim();
    if (trimmed.length < 1 || trimmed.length > 2000) {
      throw new InvalidReviewContentError('Content must be between 1 and 2000 characters');
    }
  }
}
