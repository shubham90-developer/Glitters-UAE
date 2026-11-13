import { NextFunction, Request, Response } from "express";
import { isValidObjectId } from "mongoose";
import { appError } from "../../errors/appError";
import { Terms } from "./terms.model";
import { termsSchema, updateTermsSchema } from "./terms.validation";

/* ============================================================
   CREATE
============================================================ */

export const createTerms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // validate first, so only clean data reaches the database
    const validateData = termsSchema.parse(req.body);

    // check duplicate
    const existingData = await Terms.findOne({
      ...validateData,
      isDeleted: { $ne: true },
    });

    if (existingData) {
      return next(new appError("Terms already exists", 400));
    }

    const newTerms = await Terms.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Terms created successfully",
      data: newTerms,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET ALL
============================================================ */

export const getAllTerms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allTerms = await Terms.find({ isDeleted: { $ne: true } }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        allTerms.length > 0 ? "Terms retrieved successfully" : "No Terms found",
      data: allTerms,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   GET BY ID
============================================================ */

export const getTermsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new appError("Invalid Terms id", 400));
    }

    const terms = await Terms.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });

    if (!terms) {
      return next(new appError("Terms not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Terms retrieved successfully",
      data: terms,
    });
  } catch (error) {
    next(error);
  }
};

/* ============================================================
   UPDATE
============================================================ */

export const updateTerms = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return next(new appError("Invalid Terms id", 400));
    }

    const validateData = updateTermsSchema.parse(req.body);

    const updatedTerms = await Terms.findOneAndUpdate(
      { _id: id, isDeleted: { $ne: true } },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedTerms) {
      return next(new appError("Terms not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Terms updated successfully",
      data: updatedTerms,
    });
  } catch (error) {
    next(error);
  }
};
