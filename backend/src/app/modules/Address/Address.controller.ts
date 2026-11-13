import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

import { appError } from "../../errors/appError";
import { User } from "../auth/auth.model";

import { Address } from "./Address.mode";
import { addressSchema } from "./Address.validation";

/* =========================================================
   Helpers
========================================================= */

const catchAsync =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

const respond = (
  res: Response,
  statusCode: number,
  message: string,
  data?: unknown,
) =>
  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data,
  });

// Firebase UID (from verified token) -> MongoDB user _id
const getUserId = async (req: Request): Promise<string> => {
  const firebaseUid = req.user?.uid;

  if (!firebaseUid) {
    throw new appError("Unauthorized", 401);
  }

  const user = await User.findOne({ firebaseUid }).select("_id").lean();

  if (!user) {
    throw new appError("User not found", 404);
  }

  return user._id.toString();
};

const getAddressId = (req: Request): string => {
  const id = String(req.params.id);

  if (!Types.ObjectId.isValid(id)) {
    throw new appError("Invalid address id", 400);
  }

  return id;
};

const parseBody = (body: unknown) => {
  const result = addressSchema.safeParse(body);

  if (!result.success) {
    throw new appError(result.error.issues[0]?.message || "Invalid data", 400);
  }

  return result.data;
};

/* =========================================================
   GET MY ADDRESSES
========================================================= */

export const getMyAddresses = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const addresses = await Address.find({ user: userId, isDeleted: false }).sort(
    { isDefault: -1, createdAt: -1 },
  );

  respond(res, 200, "Addresses fetched successfully", addresses);
});

/* =========================================================
   CREATE ADDRESS
========================================================= */

export const createAddress = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const data = parseBody(req.body);

  const existingCount = await Address.countDocuments({
    user: userId,
    isDeleted: false,
  });

  // first address is always default
  const isDefault = existingCount === 0 ? true : data.isDefault;

  if (isDefault) {
    await Address.updateMany(
      { user: userId, isDeleted: false },
      { isDefault: false },
    );
  }

  const address = await Address.create({
    ...data,
    isDefault,
    user: userId,
  });

  respond(res, 201, "Address added successfully", address);
});

/* =========================================================
   UPDATE ADDRESS
========================================================= */

export const updateAddress = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = getAddressId(req);
  const data = parseBody(req.body);

  const address = await Address.findOne({
    _id: id,
    user: userId,
    isDeleted: false,
  });

  if (!address) {
    throw new appError("Address not found", 404);
  }

  // a default address stays default until another one is chosen
  const isDefault = data.isDefault || address.isDefault;

  if (isDefault && !address.isDefault) {
    await Address.updateMany(
      { user: userId, isDeleted: false, _id: { $ne: id } },
      { isDefault: false },
    );
  }

  address.set({ ...data, isDefault });
  await address.save();

  respond(res, 200, "Address updated successfully", address);
});

/* =========================================================
   DELETE ADDRESS (soft delete)
========================================================= */

export const deleteAddress = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = getAddressId(req);

  const address = await Address.findOneAndUpdate(
    { _id: id, user: userId, isDeleted: false },
    { isDeleted: true, isDefault: false },
    { new: false },
  );

  if (!address) {
    throw new appError("Address not found", 404);
  }

  // if the default address was removed, promote the newest remaining one
  if (address.isDefault) {
    const next = await Address.findOne({
      user: userId,
      isDeleted: false,
    }).sort({ createdAt: -1 });

    if (next) {
      next.isDefault = true;
      await next.save();
    }
  }

  respond(res, 200, "Address deleted successfully");
});
