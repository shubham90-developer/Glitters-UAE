import { NextFunction, Request, Response } from "express";

import { cloudinary } from "../../config/cloudinary";
import { appError } from "../../errors/appError";
import { Awards } from "./awards.model";
import { awardsSchema, awardsUpdateSchema } from "./awards.validation";

export const createAwards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { year, title, shortDesc } = req.body;
    const image = req.file?.path;
    if (!image) {
      return next(new Error("image is required"));
    }

    // existing data
    const existingData = await Awards.findOne({
      year,
      title,
      shortDesc,
      image,
    });
    if (existingData) {
      return next(new Error("Data already exists"));
    }

    // validate data
    const validateData = await awardsSchema.parse({
      year,
      title,
      shortDesc,
      image,
    });

    const WeOffer = await Awards.create(validateData);
    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "awards created successfully",
      data: WeOffer,
    });
  } catch (error) {
    if (req?.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`we-offer/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllAwards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const awards = await Awards.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        awards.length > 0 ? "awards retrieved successfully" : "No awards found",
      data: awards,
    });
  } catch (error) {
    next(error);
  }
};

export const awardsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const awardsById = await Awards.findOne({
      _id: req.params.id,
    });

    if (!awardsById) {
      next(new appError("Awards not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Awards retrieved successfully",
      data: awardsById,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAwards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const awardsId = req.params.id;

    const validateData: any = await awardsUpdateSchema.parse(req.body);

    if (req.file) {
      validateData.image = (req.file as any).path;
    }

    const updateAward = await Awards.findByIdAndUpdate(awardsId, validateData, {
      new: true,
      runValidators: true,
    });

    if (!updateAward) {
      return next(new appError("Awards not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Awards updated successfully",
      data: updateAward,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAwards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const awards = await Awards.findOneAndDelete({
      _id: req.params.id,
    });

    if (!awards) {
      next(new appError("awards not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "awards deleted successfully",
      data: awards,
    });
  } catch (error) {
    next(error);
  }
};
