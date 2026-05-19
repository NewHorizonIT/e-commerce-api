import { Router } from 'express';
import { AuthController } from './controller';
import {
  loginSchema,
  listAccountsQuerySchema,
  registerSchema,
  requireRefreshTokenCookie,
  validateBody,
  validateQuery,
  validateParams,
  accountIdParamSchema,
  updateAccountSchema,
} from './validate';
import authenticate from '@/shared/middleware/authenticate';
import authorizeRole from '@/shared/middleware/authorizeRole';

export function createAuthRouter(controller: AuthController): Router {
  const authRouter = Router();

  authRouter.post('/accounts', validateBody(registerSchema), controller.register.bind(controller));
  authRouter.get(
    '/accounts',
    authenticate,
    authorizeRole('admin'),
    validateQuery(listAccountsQuerySchema),
    controller.listAccounts.bind(controller)
  );
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

  authRouter.patch(
    '/accounts/me',
    authenticate,
    validateBody(updateAccountSchema),
    controller.updateAccount.bind(controller)
  );

  // Admin endpoints
  authRouter.patch(
    '/accounts/:id/lock',
    authenticate,
    authorizeRole('admin'),
    validateParams(accountIdParamSchema),
    controller.lockAccount.bind(controller)
  );

  authRouter.patch(
    '/accounts/:id/unlock',
    authenticate,
    authorizeRole('admin'),
    validateParams(accountIdParamSchema),
    controller.unlockAccount.bind(controller)
  );

  authRouter.post(
    '/accounts/:id/reset-password',
    authenticate,
    authorizeRole('admin'),
    validateParams(accountIdParamSchema),
    controller.resetPassword.bind(controller)
  );

  return authRouter;
}
