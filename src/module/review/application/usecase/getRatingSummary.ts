import { inject, injectable } from "tsyringe";
import { REVIEW_TOKENS } from "../../tokens";
import { IReviewRepository } from "../../domain/interface";
import { RatingSummaryDTO } from "../dtos";

@injectable()
export class GetRatingSummaryUseCase {
  constructor(
    @inject(REVIEW_TOKENS.IReviewRepository)
    private readonly reviewRepository: IReviewRepository
  ) {}

  execute(productId: number): Promise<RatingSummaryDTO> {
    return this.reviewRepository.getRatingSummary(productId);
  }
}