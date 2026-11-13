/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";
import { HomeBanner } from "./homeBanner.model";
import { appError } from "../../errors/appError";
import {
  homeBannerUpdateSchema,
  homeBanneSchema,
} from "./homeBanner.validation";
import { cloudinary } from "../../config/cloudinary";

export const createHomeBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, subTitle, shortDesc, status } = req.body;

    const bgVideo = req.file?.path;

    if (!bgVideo) {
      return next(new appError("Video is required", 400));
    }

    // existing
    const exixtingHomeBanner = await HomeBanner.findOne({
      title,
      subTitle,
      shortDesc,
      bgVideo,
      status,
    });

    if (exixtingHomeBanner) {
      return next(new appError("Banner already exists", 400));
    }

    const validateData = homeBanneSchema.parse({
      title,
      subTitle,
      shortDesc,
      bgVideo,
      status,
    });

    const homeBanner = await HomeBanner.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Banner created successfully",
      data: homeBanner,
    });
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`restaurant-categories/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllHomeBanner = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const homeBanner = await HomeBanner.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        homeBanner.length > 0
          ? "Banner retrieved successfully"
          : "No banner found",
      data: homeBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const homeBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const homeBanner = await HomeBanner.findOne({
      _id: req.params.id,
    });

    if (!homeBanner) {
      next(new appError("Banner not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Banner retrieved successfully",
      data: homeBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const updateHomeBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const homeBannerId = req.params.id;

    // Find existing banner
    const existingBanner = await HomeBanner.findById(homeBannerId);

    if (!existingBanner) {
      return next(new appError("Home Banner not found", 404));
    }

    const { title, subTitle, shortDesc } = req.body;

    // Prepare update data
    const updateData: {
      title?: string;
      subTitle?: string;
      shortDesc?: string;
      bgVideo?: string;
      status?: boolean;
    } = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (subTitle !== undefined) {
      updateData.subTitle = subTitle;
    }

    if (shortDesc !== undefined) {
      updateData.shortDesc = shortDesc;
    }

    // New video uploaded
    if (req.file?.path) {
      updateData.bgVideo = req.file.path;
    }

    // Validate update data
    const validatedData = homeBannerUpdateSchema.parse(updateData);

    // Update banner
    const updatedHomeBanner = await HomeBanner.findByIdAndUpdate(
      homeBannerId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedHomeBanner) {
      return next(new appError("Home Banner not found", 404));
    }

    // Delete old video from Cloudinary only after successful DB update
    if (req.file?.path && existingBanner.bgVideo) {
      try {
        const oldVideoUrl = existingBanner.bgVideo;

        const publicIdWithExtension = oldVideoUrl.split("/").pop();

        const publicId = publicIdWithExtension?.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(`home-banners/${publicId}`, {
            resource_type: "video",
          });
        }
      } catch (cloudinaryError) {
        console.error("Old video deletion failed:", cloudinaryError);
      }
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Home Banner updated successfully",
      data: updatedHomeBanner,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteHomeBannerById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const homeBanner = await HomeBanner.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!homeBanner) {
      next(new appError("Banner not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Banner deleted successfully",
      data: homeBanner,
    });
  } catch (error) {
    next(error);
  }
};
