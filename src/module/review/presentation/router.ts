import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import { ReviewController } from './controller';
import {
  createReviewSchema,
  updateReviewSchema,
  listReviewsQuerySchema,
  reviewIdParamSchema,
  productIdParamSchema,
  validateRequest,
} from './validate';

export function createReviewRouter(controller: ReviewController): Router {
  const router = Router();

  // 🔹 Create review (user phải login)
  router.post(
    '/reviews',
    authenticate,
    validateRequest({ body: createReviewSchema }),
    controller.createReview.bind(controller)
  );

  // 🔹 Update review
  router.patch(
    '/reviews/:reviewId',
    authenticate,
    validateRequest({
      params: reviewIdParamSchema,
      body: updateReviewSchema,
    }),
    controller.updateReview.bind(controller)
  );

  // 🔹 List reviews (public)
  router.get(
    '/reviews',
    validateRequest({ query: listReviewsQuerySchema }),
    controller.listReviews.bind(controller)
  );

  // 🔹 List reviews by product (public)
  router.get(
    '/products/:productId/reviews',
    validateRequest({ params: productIdParamSchema, query: listReviewsQuerySchema }),
    controller.listProductReviews.bind(controller)
  );

  // 🔹 Rating summary theo product
  router.get(
    '/products/:productId/reviews/summary',
    validateRequest({ params: productIdParamSchema }),
    controller.getRatingSummary.bind(controller)
  );

  return router;
}
