import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import { OrderController } from './controller';
import {
  listOrdersQuerySchema,
  orderIdParamSchema,
  createOrderSchema,
  updateOrderPaymentSchema,
  updateOrderStatusSchema,
  accountIdParamSchema,
  shippingInfoIdParamSchema,
  discountCodeIdParamSchema,
  validateRequest,
} from './validate';

export function createOrderRouter(controller: OrderController): Router {
  const router = Router();

  // ===== Public / User =====
  router.get(
    '/orders',
    // authenticate,
    validateRequest({ query: listOrdersQuerySchema }),
    controller.listOrders.bind(controller)
  );

  router.get(
    '/orders/:orderId',
    authenticate,
    validateRequest({ params: orderIdParamSchema }),
    controller.findOrderById.bind(controller)
  );

  router.post(
    '/orders',
    authenticate,
    validateRequest({ body: createOrderSchema }),
    controller.createOrder.bind(controller)
  );

  //   router.patch(
  //     '/orders/:orderId/payment',
  //     authenticate,
  //     validateRequest({
  //       params: orderIdParamSchema,
  //       body: updateOrderPaymentSchema,
  //     }),
  //     controller.updateOrderPayment.bind(controller)
  //   );

  // ===== Admin =====
  router.get(
    '/admin/orders',
    authenticate,
    validateRequest({ query: listOrdersQuerySchema }),
    controller.listOrders.bind(controller)
  );

  router.get(
    '/admin/orders/:orderId',
    authenticate,
    validateRequest({ params: orderIdParamSchema }),
    controller.findOrderById.bind(controller)
  );

  router.patch(
    '/admin/orders/:orderId/status',
    authenticate,
    validateRequest({
      params: orderIdParamSchema,
      body: updateOrderStatusSchema,
    }),
    controller.updateOrderStatus.bind(controller)
  );

  //   router.get(
  //     '/admin/orders/check/account/:accountId',
  //     authenticate,
  //     validateRequest({ params: accountIdParamSchema }),
  //     controller.hasOrdersByAccount.bind(controller)
  //   );

  //   router.get(
  //     '/admin/orders/check/shipping-info/:shippingInfoId',
  //     authenticate,
  //     validateRequest({ params: shippingInfoIdParamSchema }),
  //     controller.hasOrdersByShippingInfo.bind(controller)
  //   );

  //   router.get(
  //     '/admin/orders/check/discount-code/:discountCodeId',
  //     authenticate,
  //     validateRequest({ params: discountCodeIdParamSchema }),
  //     controller.hasOrdersByDiscountCode.bind(controller)
  //   );

  return router;
}
