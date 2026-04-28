import { type DependencyContainer } from 'tsyringe';
import { REVIEW_TOKENS } from './tokens';
import { TypeORMReviewRepository } from './infrastructure/repository';
import { ReviewModuleAdapter } from './module_adapter';
import { ReviewController } from './presentation/controller';
import { CreateReviewUseCase } from './application/usecase/createReview';
import { UpdateReviewUseCase } from './application/usecase/updateReview';
import { ListReviewsUseCase } from './application/usecase/listReviews';
import { GetRatingSummaryUseCase } from './application/usecase/getRatingSummary';

export function registerReviewDependencies(container: DependencyContainer): void {
  container.registerSingleton(
    REVIEW_TOKENS.IReviewRepository,
    TypeORMReviewRepository
  );
  container.registerSingleton(REVIEW_TOKENS.createReview, CreateReviewUseCase);
  container.registerSingleton(REVIEW_TOKENS.updateReview, UpdateReviewUseCase);
  container.registerSingleton(REVIEW_TOKENS.listReviews, ListReviewsUseCase);
  container.registerSingleton(REVIEW_TOKENS.getRatingSummary, GetRatingSummaryUseCase);
  container.registerSingleton(REVIEW_TOKENS.IReviewModulePort, ReviewModuleAdapter);
  container.registerSingleton(ReviewController);
}
