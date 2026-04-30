import { AppError } from "@/shared/error/error";

export class InvalidTimeRangeError extends AppError {
  constructor(startTime: string, endTime: string) {
    super(
      `Invalid time range: startTime (${startTime}) must be before endTime (${endTime}).`,
      'PROMOTION_INVALID_TIME_RANGE',
      400
    );
  }
}

export class StartTimeInPastError extends AppError {
  constructor(startTime: string) {
    const now = new Date();
    super(
      `Invalid startTime: (${startTime}) must be greater than current time (${now}).`,
      'PROMOTION_START_TIME_INVALID',
      400
    );
  }
}

export class NotFoundPromotionByIdError extends AppError {
  constructor(id: number) {
    super(`Promotion with ID ${id} not found`, 'NOT_FOUND_PROMOTION_BY_ID', 404);
  }
}