import { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../error/error';

type Role = 'admin' | 'user';

function authorizeRole(required: Role | Role[]) {
  const requiredRoles = Array.isArray(required) ? required : [required];

  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.userRole;

    if (!req.userId) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!role) {
      return next(new ForbiddenError('User role missing'));
    }

    if (!requiredRoles.includes(role as Role)) {
      return next(new ForbiddenError('Insufficient role privileges'));
    }

    return next();
  };
}

export default authorizeRole;
