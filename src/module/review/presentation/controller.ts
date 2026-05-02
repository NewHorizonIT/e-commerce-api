import { injectable, inject } from 'tsyringe';
import type { Request, Response } from 'express';
import { IReviewModulePort } from '../application/module_port';
import { REVIEW_TOKENS } from '../tokens';
import { appLogger } from '@/shared/logging/appLogger';
import SuccessResponse from '@/shared/response/writeResponse';
import { StatusCode } from '@/shared/response/statusCode';
import { ReviewListQueryDTO } from '../application/dtos';

@injectable()
export class ReviewController {
  constructor(
    @inject(REVIEW_TOKENS.IReviewModulePort)
    private readonly reviewModulePort: IReviewModulePort
  ) {}

  // 🔹 Create review
  async createReview(req: Request, res: Response): Promise<void> {
    const review = await this.reviewModulePort.createReview(req.body);

    appLogger.info('Review created', { reviewId: review.id });

    new SuccessResponse(review, 'Review created successfully', StatusCode.CREATED).send(res);
  }

  // 🔹 Update review
  async updateReview(req: Request, res: Response): Promise<void> {
    const { reviewId } = req.params as { reviewId: string };

    const review = await this.reviewModulePort.updateReview(Number(reviewId), req.body);

    new SuccessResponse(review, 'Review updated successfully', StatusCode.OK).send(res);
  }

  // 🔹 List reviews
  async listReviews(req: Request, res: Response): Promise<void> {
    const reviews = await this.reviewModulePort.listReviews(req.query as never);

    new SuccessResponse(reviews, undefined, StatusCode.OK).send(res);
  }

  // 🔹 List reviews by product
  async listProductReviews(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };
    const query = this.parseReviewListQuery(req.query);

    const reviews = await this.reviewModulePort.listReviews({
      ...query,
      productId: Number(productId),
    });

    new SuccessResponse(reviews, undefined, StatusCode.OK).send(res);
  }

  // 🔹 Get rating summary
  async getRatingSummary(req: Request, res: Response): Promise<void> {
    const { productId } = req.params as { productId: string };

    const summary = await this.reviewModulePort.getRatingSummary(Number(productId));

    new SuccessResponse(summary, undefined, StatusCode.OK).send(res);
  }

  private parseReviewListQuery(query: Request['query']): ReviewListQueryDTO {
    const page = Number(Array.isArray(query.page) ? query.page[0] : query.page);
    const limit = Number(Array.isArray(query.limit) ? query.limit[0] : query.limit);
    const sortBy = Array.isArray(query.sortBy) ? query.sortBy[0] : query.sortBy;
    const sortOrder = Array.isArray(query.sortOrder) ? query.sortOrder[0] : query.sortOrder;
    const productId = Array.isArray(query.productId) ? query.productId[0] : query.productId;

    return {
      page: Number.isFinite(page) && page > 0 ? page : 1,
      limit: Number.isFinite(limit) && limit > 0 ? limit : 10,
      ...(typeof productId === 'string' && productId.trim() !== ''
        ? { productId: Number(productId) }
        : {}),
      ...(typeof sortBy === 'string' && sortBy.trim() !== '' ? { sortBy } : {}),
      ...(sortOrder === 'ASC' || sortOrder === 'DESC' ? { sortOrder } : {}),
    };
  }
}
