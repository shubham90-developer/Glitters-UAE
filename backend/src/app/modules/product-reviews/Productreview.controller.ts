import { NextFunction, Request, RequestHandler, Response } from "express";
import { Types } from "mongoose";

import { cloudinary } from "../../config/cloudinary";
import { appError } from "../../errors/appError";
import { User } from "../auth/auth.model";
import { Product } from "../products/product.model";

import { IReviewSummary } from "./Productreview.interface";
import { ProductReview } from "./Productreview.model ";
import { createReviewSchema } from "./Productreview.validation";

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

const assertObjectId = (value: string, label: string) => {
  if (!Types.ObjectId.isValid(value)) {
    throw new appError(`Invalid ${label}`, 400);
  }
};

// best effort: remove an image from Cloudinary (never throws)
const removeImage = async (publicId?: string) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

// Firebase UID (from verified token) -> MongoDB user _id
const getUserId = async (req: Request): Promise<string> => {
  const firebaseUid = req.user?.uid;

  if (!firebaseUid) {
    throw new appError("Please login to continue", 401);
  }

  const user = await User.findOne({ firebaseUid }).select("_id").lean();

  if (!user) {
    throw new appError("User not found", 404);
  }

  return user._id.toString();
};

const getPagination = (req: Request) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));

  return { page, limit, skip: (page - 1) * limit };
};

// rating summary: total, average, 1-5 star counts
const getSummary = async (productId: string): Promise<IReviewSummary> => {
  const rows = await ProductReview.aggregate<{ _id: number; count: number }>([
    { $match: { product: new Types.ObjectId(productId) } },
    { $group: { _id: "$rating", count: { $sum: 1 } } },
  ]);

  const distribution: IReviewSummary["distribution"] = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let total = 0;
  let sum = 0;

  for (const row of rows) {
    const star = row._id as 1 | 2 | 3 | 4 | 5;

    if (distribution[star] !== undefined) {
      distribution[star] = row.count;
      total += row.count;
      sum += star * row.count;
    }
  }

  return {
    total,
    average: total ? Math.round((sum / total) * 10) / 10 : 0,
    distribution,
  };
};

/* =========================================================
   PUBLIC: GET REVIEWS OF A PRODUCT
   GET /product-reviews/product/:productId?page=1&limit=20
========================================================= */

export const getProductReviews = catchAsync(async (req, res) => {
  const productId = String(req.params.productId);
  assertObjectId(productId, "product id");

  const { page, limit, skip } = getPagination(req);

  const [reviews, summary] = await Promise.all([
    ProductReview.find({ product: productId })
      .select(
        "name rating reviewTitle review image isVerified helpfulCount createdAt",
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    getSummary(productId),
  ]);

  respond(res, 200, "Reviews fetched successfully", {
    reviews,
    summary,
    page,
    limit,
  });
});

/* =========================================================
   CUSTOMER: GET MY REVIEW OF A PRODUCT (or null)
   GET /product-reviews/product/:productId/mine
========================================================= */

export const getMyReview = catchAsync(async (req, res) => {
  const productId = String(req.params.productId);
  assertObjectId(productId, "product id");

  const userId = await getUserId(req);

  const review = await ProductReview.findOne({
    product: productId,
    user: userId,
  })
    .select("rating reviewTitle review image createdAt")
    .lean();

  respond(res, 200, "Review fetched successfully", review ?? null);
});

/* =========================================================
   CUSTOMER: CREATE REVIEW (published immediately)
   POST /product-reviews/product/:productId   (multipart/form-data)
   fields: name, email, rating, reviewTitle, review, image (optional file)
========================================================= */

export const createReview = catchAsync(async (req, res) => {
  // the image is already uploaded by multer at this point
  const file = req.file as
    | (Express.Multer.File & { filename?: string })
    | undefined;

  try {
    const productId = String(req.params.productId);
    assertObjectId(productId, "product id");

    const userId = await getUserId(req);

    const parsed = createReviewSchema.safeParse(req.body);

    if (!parsed.success) {
      throw new appError(
        parsed.error.issues[0]?.message || "Invalid data",
        400,
      );
    }

    const productExists = await Product.exists({
      _id: productId,
      isDeleted: false,
    });

    if (!productExists) {
      throw new appError("Product not found", 404);
    }

    const alreadyReviewed = await ProductReview.exists({
      product: productId,
      user: userId,
    });

    if (alreadyReviewed) {
      throw new appError("You have already reviewed this product", 409);
    }

    try {
      await ProductReview.create({
        product: productId,
        user: userId,
        name: parsed.data.name,
        email: parsed.data.email.toLowerCase(),
        rating: parsed.data.rating,
        reviewTitle: parsed.data.reviewTitle,
        review: parsed.data.review,
        image: file?.path ?? "",
        imageId: file?.filename ?? "",
      });
    } catch (error) {
      // two requests at the same time hit the unique index
      if ((error as { code?: number }).code === 11000) {
        throw new appError("You have already reviewed this product", 409);
      }

      throw error;
    }

    respond(res, 201, "Thank you! Your review has been published.");
  } catch (error) {
    // do not leave an orphan image in Cloudinary when saving failed
    await removeImage(file?.filename);
    throw error;
  }
});

/* =========================================================
   ADMIN: LIST ALL REVIEWS
   GET /product-reviews?page=1&limit=20
========================================================= */

export const getAllReviews = catchAsync(async (req, res) => {
  const { page, limit, skip } = getPagination(req);

  const [reviews, total] = await Promise.all([
    ProductReview.find()
      .populate({ path: "product", select: "_id productName" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    ProductReview.countDocuments(),
  ]);

  respond(res, 200, "Reviews fetched successfully", {
    reviews,
    total,
    page,
    limit,
  });
});

/* =========================================================
   ADMIN: DELETE REVIEW (also removes its image)
   DELETE /product-reviews/:id
========================================================= */

export const deleteReview = catchAsync(async (req, res) => {
  const id = String(req.params.id);
  assertObjectId(id, "review id");

  const review = await ProductReview.findByIdAndDelete(id);

  if (!review) {
    throw new appError("Review not found", 404);
  }

  await removeImage(review.imageId);

  respond(res, 200, "Review deleted successfully");
});
