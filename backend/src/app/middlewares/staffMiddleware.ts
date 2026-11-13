import { Response, NextFunction } from "express";
import { userInterface } from "./userInterface";
import { appError } from "../errors/appError";

export const staffMiddleware = async (
  req: userInterface,
  res: Response,
  next: NextFunction
) => {
  
  
  try {
    // Check if user exists in request (set by authMiddleware)
    if (!req.user) {
      return next(new appError("Authentication required", 401));
    }
    

    // Check if user is a staff member
    if (req.user.role !== 'staff') {
      return next(new appError("Access denied. Staff access required", 403));
    }

    // Check if staff is active
    if (req.user.status !== 'active') {
      return next(new appError("Your account is inactive", 403));
    }

    // User is a staff member, proceed to next middleware
    next();
  } catch (error) {
    next(error);
  }
};