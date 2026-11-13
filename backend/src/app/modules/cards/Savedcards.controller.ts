import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

import { appError } from "../../errors/appError";
import { User } from "../auth/auth.model";
import { SavedCard } from "./Savedcards.model";
import { addSavedCardSchema } from "./Savedcards.validation";

/* ---------- Helpers (same style as wishlist) ---------- */

const catchAsync =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next: NextFunction) => {
    Promise.resolve(fn(req, res)).catch(next);
  };

const respond = (
  res: Response,
  statusCode: number,
  message: string,
  extra: Record<string, unknown> = {},
) =>
  res.status(statusCode).json({ success: true, statusCode, message, ...extra });

const assertObjectId = (value: string, label: string) => {
  if (!Types.ObjectId.isValid(value))
    throw new appError(`Invalid ${label}`, 400);
};

const getUserId = async (req: Request): Promise<string> => {
  const firebaseUid = req.user?.uid;
  if (!firebaseUid) throw new appError("Unauthorized", 401);

  const user = await User.findOne({ firebaseUid }).select("_id").lean();
  if (!user) throw new appError("User not found", 404);

  return user._id.toString();
};

/* ---------- GET ALL ---------- */

export const getSavedCards = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const cards = await SavedCard.find({ user: userId, isDeleted: false }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return respond(res, 200, "Saved cards retrieved successfully", {
    totalItems: cards.length,
    data: cards,
  });
});

/* ---------- ADD ---------- */

export const addSavedCard = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const body = addSavedCardSchema.parse(req.body);

  const activeCount = await SavedCard.countDocuments({
    user: userId,
    isDeleted: false,
  });

  // First card is always default
  const makeDefault = body.isDefault || activeCount === 0;

  if (makeDefault) {
    await SavedCard.updateMany(
      { user: userId, isDeleted: false },
      { $set: { isDefault: false } },
    );
  }

  const card = await SavedCard.create({
    ...body,
    user: userId,
    isDefault: makeDefault,
  });

  return respond(res, 201, "Card saved successfully", { data: card });
});

/* ---------- SET DEFAULT ---------- */

export const setDefaultCard = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = String(req.params.id);
  assertObjectId(id, "card id");

  const card = await SavedCard.findOne({
    _id: id,
    user: userId,
    isDeleted: false,
  });
  if (!card) throw new appError("Card not found", 404);

  await SavedCard.updateMany(
    { user: userId, isDeleted: false },
    { $set: { isDefault: false } },
  );

  card.isDefault = true;
  await card.save();

  return respond(res, 200, "Default card updated", { data: card });
});

/* ---------- DELETE (soft) ---------- */

export const deleteSavedCard = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = String(req.params.id);
  assertObjectId(id, "card id");

  const card = await SavedCard.findOneAndUpdate(
    { _id: id, user: userId, isDeleted: false },
    { $set: { isDeleted: true, isDefault: false } },
    { new: true },
  );
  if (!card) throw new appError("Card not found", 404);

  // If the default card was removed, promote the newest remaining card
  const hasDefault = await SavedCard.exists({
    user: userId,
    isDeleted: false,
    isDefault: true,
  });

  if (!hasDefault) {
    await SavedCard.findOneAndUpdate(
      { user: userId, isDeleted: false },
      { $set: { isDefault: true } },
      { sort: { createdAt: -1 } },
    );
  }

  return respond(res, 200, "Card removed successfully", { data: card });
});
