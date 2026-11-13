import { NextFunction, Request, RequestHandler, Response } from "express";
import { FilterQuery, Types } from "mongoose";

import { appError } from "../../errors/appError";
import { Product } from "../products/product.model";
import { User } from "../auth/auth.model";

import { IWishlist } from "./wishlist.interface";
import { Wishlist } from "./wishlist.model";
import { wishlistSchema } from "./wishlist.validation";

/* =========================================================
   Helpers
========================================================= */

const productPopulate = {
  path: "product",
  populate: [
    { path: "brand", select: "name" },
    { path: "material", select: "name" },
    { path: "variants.size", select: "size" },
    { path: "variants.color", select: "colorName" },
  ],
};

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
) => {
  return res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    ...extra,
  });
};

const assertObjectId = (value: string, label: string): void => {
  if (!Types.ObjectId.isValid(value)) {
    throw new appError(`Invalid ${label}`, 400);
  }
};

/* =========================================================
   Firebase UID -> MongoDB User ID
========================================================= */

const getUserId = async (req: Request): Promise<string> => {
  const firebaseUid = req.user?.uid;

  if (!firebaseUid) {
    throw new appError("Unauthorized", 401);
  }

  const user = await User.findOne({
    firebaseUid,
  })
    .select("_id")
    .lean();

  if (!user) {
    throw new appError("User not found", 404);
  }

  return user._id.toString();
};

/* =========================================================
   Find Wishlist By ID
========================================================= */

const findPopulatedById = async (id: Types.ObjectId | string) => {
  return Wishlist.findById(id).populate(productPopulate);
};

/* =========================================================
   Soft Delete Wishlist
========================================================= */

const softDeleteOne = async (
  filter: FilterQuery<IWishlist>,
  notFoundMessage: string,
) => {
  const item = await Wishlist.findOneAndUpdate(
    {
      ...filter,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    },
  ).populate(productPopulate);

  if (!item) {
    throw new appError(notFoundMessage, 404);
  }

  return item;
};

/* =========================================================
   ADD TO WISHLIST
========================================================= */

export const addToWishlist = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const { product: productId } = wishlistSchema.parse(req.body);

  assertObjectId(productId, "product id");

  /* Check product */

  const productExists = await Product.exists({
    _id: productId,
    status: "active",
    isDeleted: false,
  });

  if (!productExists) {
    throw new appError("Product not found", 404);
  }

  /* Check existing wishlist */

  const existing = await Wishlist.findOne({
    user: userId,
    product: productId,
  });

  /* Already active */

  if (existing && !existing.isDeleted) {
    const populatedItem = await findPopulatedById(
      existing._id as Types.ObjectId,
    );

    return respond(res, 200, "Product already exists in wishlist", {
      data: populatedItem,
    });
  }

  /* Restore deleted wishlist */

  if (existing && existing.isDeleted) {
    existing.isDeleted = false;

    await existing.save();

    const populatedItem = await findPopulatedById(
      existing._id as Types.ObjectId,
    );

    return respond(res, 200, "Product added to wishlist successfully", {
      data: populatedItem,
    });
  }

  /* Create new wishlist */

  const item = await Wishlist.create({
    user: userId,
    product: productId,
    isDeleted: false,
  });

  const populatedItem = await findPopulatedById(item._id as Types.ObjectId);

  return respond(res, 201, "Product added to wishlist successfully", {
    data: populatedItem,
  });
});

/* =========================================================
   GET ALL WISHLIST
========================================================= */

export const getAllWishlist = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const items = await Wishlist.find({
    user: userId,
    isDeleted: false,
  })
    .populate({
      path: "product",
      match: {
        isDeleted: false,
        status: "active",
      },
      populate: [
        {
          path: "brand",
          select: "name",
        },
        {
          path: "material",
          select: "name",
        },
        {
          path: "variants.size",
          select: "size",
        },
        {
          path: "variants.color",
          select: "colorName",
        },
      ],
    })
    .sort({
      createdAt: -1,
    });

  /*
   * If a product itself is deleted/inactive,
   * populate returns null.
   *
   * Remove those wishlist records from response.
   */

  const validItems = items.filter((item) => item.product !== null);

  return respond(res, 200, "Wishlist items retrieved successfully", {
    totalItems: validItems.length,
    data: validItems,
  });
});

/* =========================================================
   GET WISHLIST BY ID
========================================================= */

export const getWishlistById = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const id = String(req.params.id);

  assertObjectId(id, "wishlist id");

  const item = await Wishlist.findOne({
    _id: id,
    user: userId,
    isDeleted: false,
  }).populate(productPopulate);

  if (!item) {
    throw new appError("Wishlist item not found", 404);
  }

  return respond(res, 200, "Wishlist item retrieved successfully", {
    data: item,
  });
});

/* =========================================================
   DELETE BY WISHLIST ID
========================================================= */

export const deleteWishlist = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const id = String(req.params.id);

  assertObjectId(id, "wishlist id");

  const item = await Wishlist.findOneAndDelete({
    _id: id,
    user: userId,
  });

  if (!item) {
    throw new appError("Wishlist item not found", 404);
  }

  return respond(res, 200, "Product removed from wishlist successfully", {
    data: item,
  });
});

/* =========================================================
   DELETE BY PRODUCT ID
========================================================= */

export const deleteWishlistByProduct = catchAsync(async (req, res) => {
  const userId = await getUserId(req);
  const productId = String(req.params.productId);

  assertObjectId(productId, "product id");

  const item = await Wishlist.findOneAndDelete({
    product: productId,
    user: userId,
  });

  if (!item) {
    throw new appError("Product not found in wishlist", 404);
  }

  return respond(res, 200, "Product removed from wishlist successfully", {
    data: item,
  });
});

/* =========================================================
   CLEAR WISHLIST
========================================================= */

export const clearWishlist = catchAsync(async (req, res) => {
  const userId = await getUserId(req);

  const result = await Wishlist.deleteMany({
    user: userId,
  });

  return respond(res, 200, "Wishlist cleared successfully", {
    deletedCount: result.deletedCount,
  });
});
