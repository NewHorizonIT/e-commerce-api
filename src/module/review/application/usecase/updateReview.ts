import { inject, injectable } from "tsyringe";
import { REVIEW_TOKENS } from "../../tokens";
import { IReviewRepository } from "../../domain/interface";
import { ReviewDetailDTO, UpdateReviewDTO } from "../dtos";
import { ReviewNotFoundError, ReviewUpdateNotAllowedError } from "./errors";
import { RatingValue, ReviewContent } from "../../domain/value_object";

@injectable()
export class UpdateReviewUseCase {
    constructor(
        @inject(REVIEW_TOKENS.IReviewRepository)
        private readonly reviewRepository: IReviewRepository
    ){} 
async updateReview(
    reviewId: number,
    dto: UpdateReviewDTO
  ): Promise<ReviewDetailDTO> {
    const review = await this.reviewRepository.findById(reviewId);

    if (!review) {
      throw new ReviewNotFoundError(reviewId);
    }

    // ⚠️ optional: giới hạn thời gian update (ví dụ 7 ngày)
    const now = new Date();
    const createdAt = new Date(review.createdAt);
    const diffDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      throw new ReviewUpdateNotAllowedError();
    }

    // validate
    if (dto.rating !== undefined) {
      new RatingValue(dto.rating);
    }

    if (dto.content !== undefined) {
      new ReviewContent(dto.content);
    }

    const updated = await this.reviewRepository.updateReview(reviewId, dto);

    if (!updated) {
      throw new ReviewNotFoundError(reviewId);
    }

    // 🔹 Save media URLs if provided
    if (dto.mediaUrls && dto.mediaUrls.length > 0) {
      await this.reviewRepository.saveReviewMedia(reviewId, dto.mediaUrls);
      
      // Reload review with updated media
      const reloaded = await this.reviewRepository.findById(reviewId);
      if (reloaded) {
        return reloaded;
      }
    }

    return updated;
  }



}