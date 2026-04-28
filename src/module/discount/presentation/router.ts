import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import { DiscountController } from './controller';
import {
  listDiscountsQuerySchema,
  discountIdParamSchema,
  discountCodeParamSchema,
  createDiscountSchema,
  updateDiscountSchema,
  updateActiveDiscountSchema,
  checkDiscountValiditySchema,
  validateRequest,
} from './validate';

export function createDiscountRouter(controller: DiscountController): Router {
  const router = Router();

  // ===== Public / User =====
  router.get(
    '/discounts',
    authenticate,
    validateRequest({ query: listDiscountsQuerySchema }),
    controller.listDiscounts.bind(controller)
  );

  // router.get(
  //   '/discounts/:discountId',
  //   authenticate,
  //   validateRequest({ params: discountIdParamSchema }),
  //   controller.findDiscountById.bind(controller)
  // );

  router.get(
    '/discounts/code/:code',
    authenticate,
    validateRequest({ params: discountCodeParamSchema }),
    controller.findDiscountByCode.bind(controller)
  );

  router.post(
    '/discounts/check-validity',
    authenticate,
    validateRequest({ body: checkDiscountValiditySchema }),
    controller.checkDiscountValidity.bind(controller)
  );

  // ===== Admin =====
  router.get(
    '/admin/discounts',
    // authenticate,
    validateRequest({ query: listDiscountsQuerySchema }),
    controller.listDiscounts.bind(controller)
  );

  router.get(
    '/admin/discounts/:discountId',
    // authenticate,
    validateRequest({ params: discountIdParamSchema }),
    controller.findDiscountById.bind(controller)
  );

  router.post(
    '/admin/discounts',
    // authenticate,
    validateRequest({ body: createDiscountSchema }),
    controller.createDiscount.bind(controller)
  );

  router.patch(
    '/admin/discounts/:discountId',
    // authenticate,
    validateRequest({
      params: discountIdParamSchema,
      body: updateDiscountSchema,
    }),
    controller.updateDiscount.bind(controller)
  );

  router.patch(
    '/admin/discounts/:discountId/active',
    // authenticate,
    validateRequest({
      params: discountIdParamSchema,
      body: updateActiveDiscountSchema,
    }),
    controller.updateActiveDiscount.bind(controller)
  );

  return router;
}
