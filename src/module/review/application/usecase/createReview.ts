import { inject, injectable } from "tsyringe";
import { IReviewRepository } from "../../domain/interface";
import { REVIEW_TOKENS } from "../../tokens";
import { CreateReviewDTO, ReviewDetailDTO } from "../dtos";
import { ReviewAlreadyExistsError, ReviewNotAllowedError } from "./errors";
import { RatingValue, ReviewContent } from "../../domain/value_object";

@injectable()
export class CreateReviewUseCase {
  constructor(
    @inject(REVIEW_TOKENS.IReviewRepository)
    private readonly reviewRepository: IReviewRepository
  ) {}

 async createReview(dto: CreateReviewDTO): Promise<ReviewDetailDTO> {
     // 1. check order delivered
     const isDelivered = await this.reviewRepository.isOrderDelivered(dto.orderId);
     if (!isDelivered) {
       throw new ReviewNotAllowedError();
     }
 
     // 2. check duplicate
     const existing = await this.reviewRepository.findByAccountProductOrder(
       dto.accountId,
       dto.productId,
       dto.orderId
     );
 
     if (existing) {
       throw new ReviewAlreadyExistsError();
     }
 
     // 3. validate value object
     new RatingValue(dto.rating);
     if (dto.content !== undefined && dto.content !== null) {
       new ReviewContent(dto.content);
     }
 
     // 4. create
     return this.reviewRepository.createReview(dto);
   }
}
