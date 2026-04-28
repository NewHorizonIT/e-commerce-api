import { Router } from 'express';
import { AuthController } from './controller';
import { loginSchema, registerSchema, requireRefreshTokenCookie, validateBody } from './validate';
import authenticate from '@/shared/middleware/authenticate';

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

  return authRouter;
}
