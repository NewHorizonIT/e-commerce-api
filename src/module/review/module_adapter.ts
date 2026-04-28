import { inject, injectable } from 'tsyringe';
import {
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewListQueryDTO,
  PaginatedReviewsDTO,
  ReviewDetailDTO,
  RatingSummaryDTO,
} from './application/dtos';

import { IReviewModulePort } from './application/module_port';
import { REVIEW_TOKENS } from './tokens';

import { CreateReviewUseCase } from './application/usecase/createReview';
import { UpdateReviewUseCase } from './application/usecase/updateReview';
import { ListReviewsUseCase } from './application/usecase/listReviews';
import {GetRatingSummaryUseCase } from './application/usecase/getRatingSummary';

@injectable()
export class ReviewModuleAdapter implements IReviewModulePort {
  constructor(
    @inject(REVIEW_TOKENS.createReview)
    private readonly createReviewUseCase: CreateReviewUseCase,
    @inject(REVIEW_TOKENS.updateReview)
    private readonly updateReviewUseCase: UpdateReviewUseCase,
    @inject(REVIEW_TOKENS.listReviews)  
    private readonly listReviewsUseCase: ListReviewsUseCase,
    @inject(REVIEW_TOKENS.getRatingSummary)
    private readonly getRatingSummaryUseCase: GetRatingSummaryUseCase
  ) {}

  createReview(dto: CreateReviewDTO): Promise<ReviewDetailDTO> {
    return this.createReviewUseCase.createReview(dto);
  }

  updateReview(reviewId: number, dto: UpdateReviewDTO): Promise<ReviewDetailDTO> {
    return this.updateReviewUseCase.updateReview(reviewId, dto);
  }

  listReviews(query: ReviewListQueryDTO): Promise<PaginatedReviewsDTO> {
    return this.listReviewsUseCase.listReviews(query);
  }

  getRatingSummary(productId: number): Promise<RatingSummaryDTO> {
    return this.getRatingSummaryUseCase.execute(productId);
  }
}
