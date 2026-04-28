import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewListQueryDTO,
  PaginatedReviewsDTO,
  ReviewDetailDTO,
  RatingSummaryDTO,
} from './dtos';

/**
 * 🔹 IReviewModulePort Interface
 * Port to communicate with other modules/layers
 */
export interface IReviewModulePort {
  createReview(dto: CreateReviewDTO): Promise<ReviewDetailDTO>;
  updateReview(id: number, dto: UpdateReviewDTO): Promise<ReviewDetailDTO>;
  listReviews(query: ReviewListQueryDTO): Promise<PaginatedReviewsDTO>;
  getRatingSummary(productId: number): Promise<RatingSummaryDTO>;
}
