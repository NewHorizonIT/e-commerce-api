import type { RequestHandler } from 'express';
import { NotFoundError } from '../error/error';

const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
};

export default notFoundHandler;
