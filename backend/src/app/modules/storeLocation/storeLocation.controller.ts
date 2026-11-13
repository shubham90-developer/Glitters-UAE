/* eslint-disable no-console */
import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";

import { cloudinary } from "../../config/cloudinary";
import {
  storeLocationSchema,
  updateStoreLocationSchema,
} from "./storeLocation.validation";
import { StoreLocation } from "./storeLocation.model";

export const createStoreLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      badgeTitle,
      storeName,
      rating,
      shortDesc,
      address,
      phone,
      email,
      workingHours,
      facebook,
      instagram,
      twitter,
      youtube,
      status,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const img = files?.img?.[0]?.path;
    const qrcode = files?.qrcode?.[0]?.path;

    // =========================
    // IMAGE REQUIRED
    // =========================
    if (!img) {
      return next(new appError("Store image is required", 400));
    }

    // existing
    const existingStoreLocation = await StoreLocation.findOne({
      storeName,
      address,
      isDeleted: false,
    });

    if (existingStoreLocation) {
      return next(new appError("Store location already exists", 400));
    }

    const validateData = storeLocationSchema.parse({
      badgeTitle,
      storeName,
      rating,
      shortDesc,
      address,
      phone,
      email,
      workingHours,
      facebook,
      instagram,
      twitter,
      youtube,
      img,
      qrcode,
      status,
    });

    const storeLocation = await StoreLocation.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "store Location created successfully",
      data: storeLocation,
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

export const getAllStoreLocation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeLocation = await StoreLocation.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        storeLocation.length > 0
          ? "store Location retrieved successfully"
          : "No banner found",
      data: storeLocation,
    });
  } catch (error) {
    next(error);
  }
};

export const StoreLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeLocation = await StoreLocation.findOne({
      _id: req.params.id,
    });

    if (!storeLocation) {
      next(new appError("store Location not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "store Location retrieved successfully",
      data: storeLocation,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStoreLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const StoreLocationId = req.params.id;

    // Find existing banner
    const existingBanner = await StoreLocation.findById(StoreLocationId);

    if (!existingBanner) {
      return next(new appError("Home Banner not found", 404));
    }

    const {
      badgeTitle,
      storeName,
      rating,
      shortDesc,
      address,
      phone,
      email,
      workingHours,
      facebook,
      instagram,
      twitter,
      youtube,
      status,
    } = req.body;

    // Prepare update data
    const updateData: {
      badgeTitle?: string;
      storeName?: string;
      rating?: string;
      shortDesc?: string;
      address?: string;
      phone?: string;
      email?: string;
      workingHours?: string;
      facebook?: string;
      instagram?: string;
      twitter?: string;
      youtube?: string;
      img?: string;
      status?: string;
    } = {};

    if (badgeTitle !== undefined) {
      updateData.badgeTitle = badgeTitle;
    }
    if (storeName !== undefined) {
      updateData.storeName = storeName;
    }

    if (rating !== undefined) {
      updateData.rating = rating;
    }

    if (shortDesc !== undefined) {
      updateData.shortDesc = shortDesc;
    }
    if (address !== undefined) {
      updateData.address = address;
    }

    if (phone !== undefined) {
      updateData.phone = phone;
    }

    if (email !== undefined) {
      updateData.email = email;
    }

    if (workingHours !== undefined) {
      updateData.workingHours = workingHours;
    }

    if (facebook !== undefined) {
      updateData.facebook = facebook;
    }

    if (instagram !== undefined) {
      updateData.instagram = instagram;
    }

    if (twitter !== undefined) {
      updateData.twitter = twitter;
    }

    if (youtube !== undefined) {
      updateData.youtube = youtube;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    // New video uploaded
    if (req.file?.path) {
      updateData.img = req.file.path;
    }

    // Validate update data
    const validatedData = updateStoreLocationSchema.parse(updateData);

    // Update banner
    const updatedStoreLocation = await StoreLocation.findByIdAndUpdate(
      StoreLocationId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedStoreLocation) {
      return next(new appError("Home Banner not found", 404));
    }

    // Delete old video from Cloudinary only after successful DB update
    if (req.file?.path && existingBanner.img) {
      try {
        const oldVideoUrl = existingBanner.img;

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
      data: updatedStoreLocation,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStoreLocationById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeLocation = await StoreLocation.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!storeLocation) {
      next(new appError("store Location not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "store Location deleted successfully",
      data: storeLocation,
    });
  } catch (error) {
    next(error);
  }
};
