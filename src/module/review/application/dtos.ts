/**
 * 🔹 DTOs for Review Module
 */

export interface CreateReviewDTO {
  productId: number;
  orderId: number;
  accountId: number;
  rating: number; // 1-5
  content: string | null;
}

export interface UpdateReviewDTO {
  rating?: number;
  content?: string;
}

export interface ReviewDetailDTO {
  id: number;
  productId: number;
  accountId: number;
  orderId: number;
  rating: number;
  content: string | null;
  createdAt: Date;
}

export interface ReviewListQueryDTO {
  productId?: number;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedReviewsDTO {
  items: ReviewDetailDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RatingDistributionDTO {
  '5': number;
  '4': number;
  '3': number;
  '2': number;
  '1': number;
}

export interface RatingSummaryDTO {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistributionDTO;
}
