import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { appBannerSchema, updateAppBannerSchema } from "./appBanner.validation";
import { AppBanner } from "./appBanner.model";

export const createAppBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { status } = req.body;

    const appBannerImage = req.file?.path;

    if (!appBannerImage) {
      return next(new appError("App Banner image is required", 400));
    }

    const existingData = await AppBanner.findOne({
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("App Banner already exists", 400));
    }

    const validatedData = appBannerSchema.parse({
      AppBanner: appBannerImage,
      status,
    });

    const createdAppBanner = await AppBanner.create(validatedData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "App Banner created successfully",
      data: createdAppBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allAppBanner = await AppBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "App Banner retrieved successfully",
      data: allAppBanner,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAppBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const AppBannerById = await AppBanner.findOne({
      _id: req.params.id,
    });

    if (!AppBannerById) {
      next(new appError("App Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "App Banner retrieved successfully",
      data: AppBannerById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateAppBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appBannerId = req.params.id;

    const existingAppBanner = await AppBanner.findById(appBannerId);

    if (!existingAppBanner) {
      return next(new appError("App Banner not found", 404));
    }

    const { status, isDeleted } = req.body;

    const updateData: {
      AppBanner?: string;
      status?: "active" | "inactive";
      isDeleted?: boolean;
    } = {};

    if (status !== undefined) {
      updateData.status = status;
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted === true || isDeleted === "true";
    }

    // New image uploaded
    if (req.file?.path) {
      updateData.AppBanner = req.file.path;
    }

    const validatedData = updateAppBannerSchema.parse(updateData);

    const updatedAppBanner = await AppBanner.findByIdAndUpdate(
      appBannerId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedAppBanner) {
      return next(new appError("App Banner not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "App Banner updated successfully",
      data: updatedAppBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const appBanner = await AppBanner.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!appBanner) {
      return next(new appError("App Banner not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "App Banner deleted successfully",
      data: appBanner,
    });
    return;
  } catch (error) {
    next(error);
  }
};
