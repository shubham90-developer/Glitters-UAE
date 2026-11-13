import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { OfferBanner } from "./offerBanner.model";
import {
  offerBannerSchema,
  updateOfferBannerSchema,
} from "./offerBanner.validation";

export const createOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, subCategory, redirectUrl, status } = req.body;

    const offerBannerImg = req.file?.path;

    if (!offerBannerImg) {
      return next(new appError("Offer banner image is required", 400));
    }

    // ============================================
    // CHECK DUPLICATE
    // ============================================

    const existingData = await OfferBanner.findOne({
      category,
      subCategory: subCategory || null,
      redirectUrl: redirectUrl || "",
      isDeleted: false,
    });

    if (existingData) {
      return next(
        new appError(
          "Offer banner already exists with the same category/sub-category",
          400,
        ),
      );
    }

    // ============================================
    // VALIDATE DATA
    // ============================================

    const validatedData = offerBannerSchema.parse({
      offerBannerImg,

      category,

      subCategory: subCategory || undefined,

      redirectUrl: redirectUrl || undefined,

      status: status || "active",

      isDeleted: false,
    });

    // ============================================
    // CREATE
    // ============================================

    const createdOfferBanner = await OfferBanner.create(validatedData);

    // ============================================
    // POPULATE
    // ============================================

    await createdOfferBanner.populate([
      {
        path: "category",
        select: "categoryName slug",
      },
      {
        path: "subCategory",
        select: "subCategoryName slug",
      },
    ]);

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Offer banner created successfully",
      data: createdOfferBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOfferBannerData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = await OfferBanner.find({
      isDeleted: false,
    })
      .populate("category", "categoryName slug")
      .populate("subCategory", "subCategoryName slug")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Offer banner data fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getOfferBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const OfferBannerById = await OfferBanner.findOne({
      _id: req.params.id,
    });

    if (!OfferBannerById) {
      next(new appError("Offer Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Offer Banner retrieved successfully",
      data: OfferBannerById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const offerBannerId = req.params.id;

    // ============================================
    // CHECK EXISTING
    // ============================================

    const existingOfferBanner = await OfferBanner.findById(offerBannerId);

    if (!existingOfferBanner) {
      return next(new appError("Offer Banner not found", 404));
    }

    // ============================================
    // FILE
    // ============================================

    const offerBannerImg = req.file?.path;

    // ============================================
    // BODY
    // ============================================

    const { category, subCategory, redirectUrl, status } = req.body;

    // ============================================
    // PREPARE UPDATE DATA
    // ============================================

    const updateData: any = {};

    if (category !== undefined) {
      updateData.category = category;
    }

    if (subCategory !== undefined) {
      updateData.subCategory = subCategory || null;
    }

    if (redirectUrl !== undefined) {
      updateData.redirectUrl = redirectUrl || "";
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    // new image only
    if (offerBannerImg) {
      updateData.offerBannerImg = offerBannerImg;
    }

    // ============================================
    // VALIDATE
    // ============================================

    const validatedData = updateOfferBannerSchema.parse(updateData);

    // ============================================
    // UPDATE
    // ============================================

    const updatedOfferBanner = await OfferBanner.findByIdAndUpdate(
      offerBannerId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedOfferBanner) {
      return next(new appError("Offer Banner not found", 404));
    }

    // ============================================
    // POPULATE
    // ============================================

    await updatedOfferBanner.populate([
      {
        path: "category",
        select: "categoryName slug",
      },
      {
        path: "subCategory",
        select: "subCategoryName slug",
      },
    ]);

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Offer Banner updated successfully",
      data: updatedOfferBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOfferBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const offerBanner = await OfferBanner.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!offerBanner) {
      return next(new appError("Offer Banner not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Offer Banner deleted successfully",
      data: offerBanner,
    });
    return;
  } catch (error) {
    next(error);
  }
};
