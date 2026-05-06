import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import authorizeRole from '@/shared/middleware/authorizeRole';
import { StatsController } from './controller';
import { statsRangeSchema, validateRequest } from './validate';

export function createStatsRouter(controller: StatsController): Router {
  const router = Router();

  router.get(
    '/admin/stats/overview',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getOverview.bind(controller)
  );

  router.get(
    '/admin/stats/orders/trend',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getOrdersTrend.bind(controller)
  );

  router.get(
    '/admin/stats/orders/status-breakdown',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getOrdersStatusBreakdown.bind(controller)
  );

  router.get(
    '/admin/stats/orders/revenue-by-status',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getOrdersRevenueByStatus.bind(controller)
  );

  router.get(
    '/admin/stats/products/top-selling',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getTopSellingProducts.bind(controller)
  );

  router.get(
    '/admin/stats/customers/top-spenders',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getTopSpenders.bind(controller)
  );

  router.get(
    '/admin/stats/reviews/summary',
    authenticate,
    authorizeRole('admin'),
    validateRequest({ query: statsRangeSchema }),
    controller.getReviewSummary.bind(controller)
  );

  return router;
}
