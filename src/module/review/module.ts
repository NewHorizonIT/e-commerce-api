import { container } from 'tsyringe';
import { Router } from 'express';
import { IReviewModulePort } from './application/module_port';
import { ReviewController } from './presentation/controller';
import { createReviewRouter } from './presentation/router';
import { REVIEW_TOKENS } from './tokens';
import './container';

export class ReviewModule {
  public readonly router: Router;
  public readonly publicApi: IReviewModulePort;

  constructor() {
    this.publicApi = container.resolve<IReviewModulePort>(
      REVIEW_TOKENS.IReviewModulePort
    );
    const controller = container.resolve(ReviewController);
    this.router = createReviewRouter(controller);
  }
}

export const reviewModule = new ReviewModule();
export const reviewPublicApi = reviewModule.publicApi;
