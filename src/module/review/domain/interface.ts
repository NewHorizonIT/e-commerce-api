import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewListQueryDTO,
  PaginatedReviewsDTO,
  ReviewDetailDTO,
  RatingSummaryDTO,
} from '../application/dtos';

/**
 * 🔹 IReviewRepository Interface
 * Defines the contract for review data persistence
 */
export interface IReviewRepository {
  // ===== CREATE =====
  createReview(dto: CreateReviewDTO): Promise<ReviewDetailDTO>;

  // ===== READ =====
  findById(id: number): Promise<ReviewDetailDTO | null>;
  findByAccountProductOrder(
    accountId: number,
    productId: number,
    orderId: number
  ): Promise<ReviewDetailDTO | null>;
  listReviews(query: ReviewListQueryDTO): Promise<PaginatedReviewsDTO>;
  getRatingSummary(productId: number): Promise<RatingSummaryDTO>;

  // ===== UPDATE =====
  updateReview(id: number, dto: UpdateReviewDTO): Promise<ReviewDetailDTO | null>;

  // ===== DELETE =====
  deleteReview(id: number): Promise<boolean>;

  // ===== HELPER =====
  checkProductExists(productId: number): Promise<boolean>;
  isOrderOwner(accountId: number, orderId: number): Promise<boolean>;
  isOrderDelivered(orderId: number): Promise<boolean>;
}
