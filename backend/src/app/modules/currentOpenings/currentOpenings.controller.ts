import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";
import { CurrentOpenings } from "./currentOpenings.model";
import {
  currentOpeningsSchema,
  updatecurrentOpeningsSchema,
} from "./currentOpenings.validation";

export const createCurrentOpenings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      jobID,
      jobTitle,
      shortDesc,
      experience,
      location,
      jobType,
      dept,
      roles,
      salary,
      openings,
      responsibilities,
      requirements,
      benefits,
      isDeleted,
    } = req.body;

    // =========================
    // CHECK EXISTING
    // =========================
    const existingData = await CurrentOpenings.findOne({
      $or: [
        { jobID },
        {
          jobTitle,
          location,
          jobType,
        },
      ],
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("Current Opening already exists", 400));
    }

    // =========================
    // VALIDATE DATA
    // =========================
    const validateData = currentOpeningsSchema.parse({
      jobID,
      jobTitle,
      shortDesc,
      experience,
      location,
      jobType,
      dept,
      roles,
      salary,
      openings,
      responsibilities,
      requirements,
      benefits,
      isDeleted,
    });

    // =========================
    // CREATE
    // =========================
    const createdOpening = await CurrentOpenings.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Current Opening created successfully",
      data: createdOpening,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCurrentOpeningsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await CurrentOpenings.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Current Openings retrieved successfully"
          : "No Current Openings found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCurrentOpeningsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentOpeningById = await CurrentOpenings.findOne({
      _id: req.params.id,
    });

    if (!currentOpeningById) {
      next(new appError("Current Openings not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Current Openings retrieved successfully",
      data: currentOpeningById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getCurrentOpeningsByTitle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentOpening = await CurrentOpenings.findOne({
      jobTitle: req.params.jobTitle,
    });

    if (!currentOpening) {
      return next(new appError("Current Opening not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: currentOpening,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCurrentOpenings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const currentOpeningsId = req.params.id;

    // validate
    const validateData = await updatecurrentOpeningsSchema.parse(req.body);

    const UpdateCurrentOpenings = await CurrentOpenings.findOneAndUpdate(
      { _id: currentOpeningsId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateCurrentOpenings) {
      return next(new appError("Current Openings not found", 404));
    }

    await UpdateCurrentOpenings.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Current Openings updated successfully",
      data: UpdateCurrentOpenings,
    });

    return;
  } catch (error) {
    next(error);
  }
};

export const deleteCurrentOpenings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteCurrentOpening = await CurrentOpenings.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteCurrentOpening) {
      next(new appError("Current Openings not found", 404));
      return;
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Current Openings deleted successfully",
      data: deleteCurrentOpening,
    });
    return;
  } catch (error) {
    next(error);
  }
};
