import { Request, Response, NextFunction } from "express";

import { firebaseAdminAuth } from "../config/firebase-admin";

declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email?: string;
        phone?: string;
      };
    }
  }
}
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
      return;
    }

    if (!authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
      return;
    }

    const token = authHeader.replace("Bearer ", "").trim();

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Firebase token is missing",
      });
      return;
    }

    const decodedToken = await firebaseAdminAuth.verifyIdToken(token);

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      phone: decodedToken.phone_number,
    };

    next();
  } catch (error) {
    console.error("Firebase token verification error:", error);

    res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
};
