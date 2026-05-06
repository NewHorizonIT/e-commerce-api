import { Router } from 'express';
import { AuthController } from './controller';
import {
  loginSchema,
  registerSchema,
  requireRefreshTokenCookie,
  validateBody,
  lockUnlockSchema,
  resetPasswordSchema,
  updateAccountSchema,
} from './validate';
import authenticate from '@/shared/middleware/authenticate';
import authorizeRole from '@/shared/middleware/authorizeRole';

export function createAuthRouter(controller: AuthController): Router {
  const authRouter = Router();

  authRouter.post('/accounts', validateBody(registerSchema), controller.register.bind(controller));
  authRouter.post('/sessions', validateBody(loginSchema), controller.login.bind(controller));
  authRouter.post(
    '/sessions/refresh',
    requireRefreshTokenCookie,
    controller.refreshToken.bind(controller)
  );

  authRouter.get('/sessions/current', authenticate, controller.getCurrentSession.bind(controller));
  authRouter.delete(
    '/sessions/current',
    requireRefreshTokenCookie,
    controller.logout.bind(controller)
  );

  // Admin endpoints
  authRouter.patch(
    '/lock-user',
    authenticate,
    authorizeRole('admin'),
    validateBody(lockUnlockSchema),
    controller.lockAccount.bind(controller)
  );

  authRouter.patch(
    '/unlock-user',
    authenticate,
    authorizeRole('admin'),
    validateBody(lockUnlockSchema),
    controller.unlockAccount.bind(controller)
  );

  authRouter.patch(
    '/reset-password',
    authenticate,
    authorizeRole('admin'),
    validateBody(resetPasswordSchema),
    controller.resetPassword.bind(controller)
  );

  authRouter.patch(
    '/account',
    authenticate,
    validateBody(updateAccountSchema),
    controller.updateAccount.bind(controller)
  );

  return authRouter;
}
