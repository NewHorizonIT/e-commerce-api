import { BadRequestError } from '@/shared/error/error';

export class RatingValue {
  public readonly value: number;

  constructor(value: number) {
    if (!Number.isFinite(value) || value < 1 || value > 5) {
      throw new BadRequestError('Rating must be a number between 1 and 5');
    }

    this.value = value;
  }
}

export class ReviewContent {
  public readonly value: string;

  constructor(value: string) {
    const normalized = value.trim();

    if (normalized.length > 255) {
      throw new BadRequestError('Review content must be <= 255 characters');
    }

    this.value = normalized;
  }
}
