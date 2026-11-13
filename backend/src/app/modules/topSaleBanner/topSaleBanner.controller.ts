import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { TopSaleBanner } from "./topSaleBanner.model";
import {
  topSaleBannerSchema,
  updateTopSaleBannerSchema,
} from "./topSaleBanner.validation";

export const createTopSaleBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status, offerBannerLink1, offerBannerLink2, offerBannerLink3 } =
      req.body;

    // ============================================
    // FILES
    // ============================================

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const offerBannerImg1 = files?.offerBannerImg1?.[0]?.path || "";

    const offerBannerImg2 = files?.offerBannerImg2?.[0]?.path || "";

    const offerBannerImg3 = files?.offerBannerImg3?.[0]?.path || "";

    // ============================================
    // VALIDATE REQUIRED IMAGES
    // ============================================

    if (!offerBannerImg1) {
      return next(new appError("Banner 1 image is required", 400));
    }

    if (!offerBannerImg2) {
      return next(new appError("Banner 2 image is required", 400));
    }

    if (!offerBannerImg3) {
      return next(new appError("Banner 3 image is required", 400));
    }

    // ============================================
    // CHECK EXISTING
    // ============================================

    const existingData = await TopSaleBanner.findOne({
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("Top Sale banner already exists", 400));
    }

    // ============================================
    // VALIDATE DATA
    // ============================================

    const validatedData = topSaleBannerSchema.parse({
      offerBannerImg1,
      offerBannerImg2,
      offerBannerImg3,

      offerBannerLink1: offerBannerLink1 || "",
      offerBannerLink2: offerBannerLink2 || "",
      offerBannerLink3: offerBannerLink3 || "",

      status: status || "active",

      isDeleted: false,
    });

    // ============================================
    // CREATE
    // ============================================

    const createdTopSaleBanner = await TopSaleBanner.create(validatedData);

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Top Sale banner created successfully",
      data: createdTopSaleBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllTopSaleBannerData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await TopSaleBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Top Sale Banner retrieved successfully"
          : "No TopSaleBanner found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getTopSaleBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const TopSaleBannerById = await TopSaleBanner.findOne({
      _id: req.params.id,
    });

    if (!TopSaleBannerById) {
      next(new appError("Top Sale Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Top Sale Banner retrieved successfully",
      data: TopSaleBannerById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateTopSaleBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topSaleBannerId = req.params.id;

    // ============================================
    // CHECK EXISTING RECORD
    // ============================================

    const existingTopSaleBanner = await TopSaleBanner.findById(topSaleBannerId);

    if (!existingTopSaleBanner) {
      return next(new appError("Top Sale Banner not found", 404));
    }

    // ============================================
    // GET FILES
    // ============================================

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const offerBannerImg1 = files?.offerBannerImg1?.[0]?.path;

    const offerBannerImg2 = files?.offerBannerImg2?.[0]?.path;

    const offerBannerImg3 = files?.offerBannerImg3?.[0]?.path;

    // ============================================
    // PREPARE UPDATE DATA
    // ============================================

    const updateData: any = {};

    // only replace image if new file uploaded

    if (offerBannerImg1) {
      updateData.offerBannerImg1 = offerBannerImg1;
    }

    if (offerBannerImg2) {
      updateData.offerBannerImg2 = offerBannerImg2;
    }

    if (offerBannerImg3) {
      updateData.offerBannerImg3 = offerBannerImg3;
    }

    // optional link updates (only when sent, empty string clears the link)

    if (req.body.offerBannerLink1 !== undefined) {
      updateData.offerBannerLink1 = req.body.offerBannerLink1;
    }

    if (req.body.offerBannerLink2 !== undefined) {
      updateData.offerBannerLink2 = req.body.offerBannerLink2;
    }

    if (req.body.offerBannerLink3 !== undefined) {
      updateData.offerBannerLink3 = req.body.offerBannerLink3;
    }

    // optional status update

    if (req.body.status !== undefined) {
      updateData.status = req.body.status;
    }

    // ============================================
    // CHECK SOMETHING TO UPDATE
    // ============================================

    if (Object.keys(updateData).length === 0) {
      return next(new appError("No data provided for update", 400));
    }

    // ============================================
    // VALIDATE
    // ============================================

    const validatedData = updateTopSaleBannerSchema.parse(updateData);

    // ============================================
    // UPDATE
    // ============================================

    const updatedTopSaleBanner = await TopSaleBanner.findByIdAndUpdate(
      topSaleBannerId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTopSaleBanner) {
      return next(new appError("Top Sale Banner not found", 404));
    }

    // ============================================
    // RESPONSE
    // ============================================

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Top Sale Banner updated successfully",
      data: updatedTopSaleBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTopSaleBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topSaleBanner = await TopSaleBanner.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!topSaleBanner) {
      return next(new appError("Top Sale Banner not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Top Sale Banner deleted successfully",
      data: topSaleBanner,
    });
    return;
  } catch (error) {
    next(error);
  }
};
