export const REVIEW_TOKENS = {
  IReviewRepository: Symbol.for('IReviewRepository'),
  ReviewUseCases: Symbol.for('ReviewUseCases'),
  IReviewModulePort: Symbol.for('IReviewModulePort'),
  createReview: Symbol.for('ReviewCreateUseCase'),
  updateReview: Symbol.for('ReviewUpdateUseCase'),
  listReviews: Symbol.for('ReviewListUseCase'),
  getRatingSummary: Symbol.for('ReviewGetRatingSummaryUseCase'),
} as const;
