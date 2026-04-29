import { NextFunction, Request, Response } from 'express';
import { verifyJwtToken } from '../utils/jwt';
import { config } from '@/config';
import { UnauthorizedError } from '../error/error';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return next(new UnauthorizedError('Authorization header missing'));
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(new UnauthorizedError('Authorization header must be Bearer <token>'));
  }

  const payload = verifyJwtToken<{ id: number; phoneNum: string; role: 'admin' | 'user' }>(
    token,
    config.jwt.accessToken.secret
  );

  // Attach user info to request object for downstream handlers
  req.userId = payload.id;
  req.userRole = payload.role;

  return next();
};

export default authenticate;
