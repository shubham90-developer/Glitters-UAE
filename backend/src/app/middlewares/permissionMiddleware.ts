import { Response, NextFunction } from 'express';
import { userInterface } from './userInterface';
import { appError } from '../errors/appError';

export const permissionMiddleware = (requiredPermission: string) => {
  return async (req: userInterface, res: Response, next: NextFunction) => {
    try {
      // Check if user exists in request (set by authMiddleware)
      if (!req.user) {
        throw new appError('Authentication required', 401);
      }

      // Admin has all permissions
      if (req.user.role === 'admin') {
        return next();
      }

      // Check admin staff permissions
      if (req.user.role === 'admin-staff') {
        if (!req.user.permissions || !req.user.permissions[requiredPermission]) {
          throw new appError(`Access denied. You don't have permission to access ${requiredPermission}`, 403);
        }
        return next();
      }

      // For other roles, deny access
      throw new appError('Insufficient permissions', 403);

    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        success: false,
        statusCode: error.statusCode || 500,
        message: error.message || 'Permission check failed'
      });
    }
  };
};