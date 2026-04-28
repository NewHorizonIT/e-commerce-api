import { inject, injectable } from "tsyringe";
import { PaginatedReviewsDTO, ReviewListQueryDTO } from "../dtos";
import { IReviewRepository } from "../../domain/interface";
import { REVIEW_TOKENS } from "../../tokens";

@injectable()
export class ListReviewsUseCase {
  constructor(
    @inject(REVIEW_TOKENS.IReviewRepository)
    private readonly reviewRepository: IReviewRepository
  ) {}
   listReviews(query: ReviewListQueryDTO): Promise<PaginatedReviewsDTO> {
      return this.reviewRepository.listReviews(query);
    }
}