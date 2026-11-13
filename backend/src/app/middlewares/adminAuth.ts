import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { appError } from "../errors/appError";
import { Admin } from "../modules/admin/admin.model";

export const adminAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return next(new appError("Authorization token missing", 401));
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    const admin = await Admin.findById(decoded.id);
    if (!admin) return next(new appError("Admin not found", 401));
    if (admin.status !== "active")
      return next(new appError("Account is not active", 403));
    if (admin.role !== "admin")
      return next(new appError("Admin access required", 403));

    (req as any).admin = admin;
    next();
  } catch {
    next(new appError("Invalid or expired token", 401));
  }
};
