import { Request, Response, NextFunction } from 'express';
import { appError } from '../errors/appError';
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const err = new appError('Not Found', 404);
  next(err);
};

export default notFound;
