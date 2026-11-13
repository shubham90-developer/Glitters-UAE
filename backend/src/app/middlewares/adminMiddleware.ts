import { Response, NextFunction } from "express";
import { userInterface } from "./userInterface";
import { appError } from "../errors/appError";

export const adminMiddleware = async (
  req: userInterface,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Check if user exists in request (set by authMiddleware)
    if (!req.user) {
      throw new appError("Authentication required", 401);
    }

    // Check if user is admin
    if (req.user.role !== "admin") {
      throw new appError(
        "Admin access required. You do not have sufficient permissions.",
        403,
      );
    }

    // Check if user is active
    if (req.user.status !== "active") {
      throw new appError("Account is not active", 403);
    }

    next();
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode || 500,
      message: error.message || "Admin authorization failed",
    });
  }
};
