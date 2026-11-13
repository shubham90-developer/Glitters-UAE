import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import httpStatus from 'http-status';

import { RequestHandler } from 'express';

const validateRequest = (schema: ZodSchema): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err: any) => ({
          path: err.path.join('.'),
          message: err.message,
        }));

                res.status(httpStatus.BAD_REQUEST).json({
          success: false,
          message: 'Validation Error',
          errors: errorMessages,
        });
      }
      next(error);
    }
  };
};

export default validateRequest;
