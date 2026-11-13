import { NextFunction, Request, Response } from "express";

import { SEOPages } from "./seopages.model";

import { SEOPagesSchema, updateSEOPagesSchema } from "./seoPages.validation";

import { appError } from "../../errors/appError";

// =====================================================
// CREATE SEO PAGES
// =====================================================

export const createSeoPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body || {};

    // ===============================================
    // FILES
    // ===============================================

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const productListBgImages =
      files?.productListBgImages?.map((file) => file.path) || [];

    const wishListBgImages =
      files?.wishListBgImages?.map((file) => file.path) || [];

    // ===============================================
    // EXISTING
    // Only one SEO Pages document allowed
    // ===============================================

    const existingData = await SEOPages.findOne({
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("SEO Pages data already exists", 400));
    }

    // ===============================================
    // VALIDATE
    // ===============================================

    const validateData = SEOPagesSchema.parse({
      productListBgImages,
      wishListBgImages,

      status: status || "active",

      isDeleted: false,
    });

    // ===============================================
    // CREATE
    // ===============================================

    const createdSeoPages = await SEOPages.create(validateData);

    return res.status(201).json({
      success: true,

      statusCode: 201,

      message: "SEO Pages created successfully",

      data: createdSeoPages,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET ALL SEO PAGES
// =====================================================

export const getAllSeoPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const seoPages = await SEOPages.find({
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,

      statusCode: 200,

      message: "SEO Pages retrieved successfully",

      data: seoPages,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// GET SEO PAGE BY ID
// =====================================================

export const getByIdSeoPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const seoPages = await SEOPages.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!seoPages) {
      return next(new appError("SEO Pages not found", 404));
    }

    return res.status(200).json({
      success: true,

      statusCode: 200,

      message: "SEO Pages retrieved successfully",

      data: seoPages,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// UPDATE SEO PAGES
// =====================================================

export const updateSeoPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // ===============================================
    // FIND EXISTING
    // ===============================================

    const existingSeoPages = await SEOPages.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!existingSeoPages) {
      return next(new appError("SEO Pages not found", 404));
    }

    // ===============================================
    // FILES
    // ===============================================

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const newProductListImages =
      files?.productListBgImages?.map((file) => file.path) || [];

    const newWishListImages =
      files?.wishListBgImages?.map((file) => file.path) || [];

    // ===============================================
    // UPDATE DATA
    // ===============================================

    const updateData: {
      productListBgImages?: string[];
      wishListBgImages?: string[];
      status?: "active" | "inactive";
    } = {};

    // ===============================================
    // APPEND PRODUCT LIST IMAGES
    // ===============================================

    if (newProductListImages.length > 0) {
      updateData.productListBgImages = [
        ...(existingSeoPages.productListBgImages || []),

        ...newProductListImages,
      ];
    }

    // ===============================================
    // APPEND WISHLIST IMAGES
    // ===============================================

    if (newWishListImages.length > 0) {
      updateData.wishListBgImages = [
        ...(existingSeoPages.wishListBgImages || []),

        ...newWishListImages,
      ];
    }

    // ===============================================
    // STATUS
    // ===============================================

    if (req.body?.status !== undefined) {
      updateData.status = req.body.status;
    }

    // ===============================================
    // VALIDATE
    // ===============================================

    const validatedData = updateSEOPagesSchema.parse(updateData);

    // ===============================================
    // UPDATE
    // ===============================================

    const updatedSeoPages = await SEOPages.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedSeoPages) {
      return next(new appError("SEO Pages not found", 404));
    }

    return res.status(200).json({
      success: true,

      statusCode: 200,

      message: "SEO Pages updated successfully",

      data: updatedSeoPages,
    });
  } catch (error) {
    next(error);
  }
};

// =====================================================
// DELETE SEO PAGES
// =====================================================

export const deleteSeoPages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const seoPages = await SEOPages.findById(id);

    if (!seoPages) {
      return next(new appError("SEO Pages not found", 404));
    }

    // SOFT DELETE

    seoPages.isDeleted = true;

    await seoPages.save();

    return res.status(200).json({
      success: true,

      statusCode: 200,

      message: "SEO Pages deleted successfully",

      data: seoPages,
    });
  } catch (error) {
    next(error);
  }
};
