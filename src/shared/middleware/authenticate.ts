import { NextFunction, Request, Response } from 'express';
import { verifyJwtToken } from '../utils/jwt';
import { config } from '@/config';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const payload = verifyJwtToken<{ userId: number; phoneNum: string }>(
    token,
    config.jwt.accessToken.secret
  );
  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to request object for downstream handlers
  req.userId = payload.userId;

  next();
};

export default authenticate;
