import { Router } from 'express';
import authenticate from '@/shared/middleware/authenticate';
import { PaymentController } from './controller';
import {
  initiatePaymentSchema,
  paymentCallbackSchema,
  paymentStatusParamSchema,
  paymentHistoryParamSchema,
  validateRequest,
} from './validate';

export function createPaymentRouter(controller: PaymentController): Router {
  const router = Router();

  // ===== Public / Authenticated User =====

  // POST /api/v1/payments/initiate
  router.post(
    '/payments/initiate',
    // authenticate,
    validateRequest(initiatePaymentSchema.shape),
    controller.initiatePayment.bind(controller)
  );

  // POST /api/v1/payments/callback
  router.post(
    '/payments/callback',
    validateRequest(paymentCallbackSchema.shape),
    controller.handleCallback.bind(controller)
  );

  // GET /api/v1/payments/status/:transactionRef
  router.get(
    '/payments/status/:transactionRef',
    authenticate,
    validateRequest(paymentStatusParamSchema.shape),
    controller.getPaymentStatus.bind(controller)
  );

  // GET /api/v1/payments/history/:transactionRef
  router.get(
    '/payments/history/:transactionRef',
    authenticate,
    validateRequest(paymentHistoryParamSchema.shape),
    controller.getPaymentHistory.bind(controller)
  );

  return router;
}
