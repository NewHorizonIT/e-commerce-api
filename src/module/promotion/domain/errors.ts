import { AppError } from "@/shared/error/error";

export class InvalidPromotionStatusError extends AppError {
  constructor(status: string) {
    super(
      `The promotion status "${status}" is invalid.`,
      'PROMOTION_INVALID_STATUS',
      400
    );
  }
}

export class InvalidPromotionTypeError extends AppError {
  constructor(type: string) {
    super(
      `The promotion type "${type}" is invalid.`,
      'PROMOTION_INVALID_TYPE',
      400
    );
  }
}

export class UnexpectedMissingPromotionIdError extends AppError {
  constructor(){
    super("Promotion ID missing after save", 'MISSING_PROMOTION_ID', 500);
  }
}

export class UnexpectedMissingPromotionDetailIdError extends AppError {
  constructor(){
    super("PromotionDetail ID missing after save", 'MISSING_PROMOTIONDETAIL_ID', 500);
  }
}

export class InvalidTimeRangeError extends AppError {
  constructor(startTime: Date, endTime: Date) {
    super(
      `Invalid time range: startTime (${startTime.toISOString()}) must be before endTime (${endTime.toISOString()}).`,
      'PROMOTION_INVALID_TIME_RANGE',
      400
    );
  }
}

export class StartTimeInPastError extends AppError {
  constructor(startTime: Date) {
    const now = new Date();
    super(
      `Invalid startTime: (${startTime.toISOString()}) must be greater than current time (${now.toISOString()}).`,
      'PROMOTION_START_TIME_INVALID',
      400
    );
  }
}