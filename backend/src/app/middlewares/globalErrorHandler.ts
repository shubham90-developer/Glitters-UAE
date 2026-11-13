import { Request, Response, NextFunction } from 'express';
import handleCastError from '../errors/handleCastError';
import handleDuplicateError from '../errors/handleDuplicateError';
import handleZodError from '../errors/handleZodError';
import handleValidationError from '../errors/handleValidationError';
import { ZodError } from 'zod';
const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.name === 'CastError') err = handleCastError(err);
  if (err.code === 11000) err = handleDuplicateError(err);
  if (err.name === 'ValidationError') err = handleValidationError(err);
  if (err instanceof ZodError) err = handleZodError(err);

  res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    errorMessages: err.errors || [{ path: '', message: err.message }],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export default globalErrorHandler;
