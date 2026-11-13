import { Response, NextFunction } from "express";
import { appError } from "../errors/appError";
import { userInterface } from "./userInterface";

export const requirePermission = (permission: string) => {
  return (req: userInterface, res: Response, next: NextFunction) => {
    const user = req.user as any;

    if (!user) {
      return next(new appError("Unauthorized", 401));
    }

    // Regular admin has full access — skip permission check
    if (user.role === "admin") {
      return next();
    }

    // Role/staff users must have the specific permission
    if (!user.permissions?.includes(permission)) {
      return next(
        new appError(
          `Access denied. Required permission: "${permission}"`,
          403,
        ),
      );
    }

    next();
  };
};
