import jwt from "jsonwebtoken";
import { IUser } from "../modules/auth/auth.model";

// The role module (../modules/role/role.interface) is not part of this
// codebase, so the fields used for the token are described here instead.
export interface IRoleTokenSource {
  _id: unknown;
  employeeName?: string;
  email?: string;
  role?: string;
  permissions?: unknown;
}

// IUser has no `role` field, so it is read as an optional extra property.
type UserWithOptionalRole = IUser & { role?: string };

// Existing function — no changes, User flow untouched
export const generateToken = (user: UserWithOptionalRole) => {
  const payload = {
    userId: user._id,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// New function — for Role/staff users only
export const generateRoleToken = (role: IRoleTokenSource) => {
  const payload = {
    userId: role._id,
    name: role.employeeName,
    email: role.email,
    role: role.role,
    permissions: role.permissions,
    isRoleUser: true, // flag used in authMiddleware to separate the two flows
  };
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
};
