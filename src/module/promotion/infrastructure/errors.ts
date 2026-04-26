import { AppError } from "@/shared/error/error";

export class NotFoundPromotionError extends AppError {
  constructor(promotionId: number) {
    super(
      `The promotion id "${promotionId}" not found.`,
      'PROMOTION_NOT_FOUND',
      404
    );
  }
}