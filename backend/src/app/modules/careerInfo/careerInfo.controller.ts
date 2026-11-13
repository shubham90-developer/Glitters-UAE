import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";

import { CareerInfo } from "./careerInfo.model";
import {
  careerInfoSchema,
  updatecareerInfoSchema,
} from "./careerInfo.validation";

export const createCareerInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      badgeText,
      heroTitle,
      heroHighlight,
      heroDescription,

      benefitsLabel,
      benefitsTitle,
      employeeBenefits,

      cultureTitle,
      cultureDescription,
      culturePoints,

      hiringProcessLabel,
      hiringProcessTitle,
      hiringProcess,
    } = req.body;

    // existing
    const existingData = await CareerInfo.findOne({
      badgeText,
      heroTitle,
      heroHighlight,
      heroDescription,

      benefitsLabel,
      benefitsTitle,
      employeeBenefits,

      cultureTitle,
      cultureDescription,
      culturePoints,

      hiringProcessLabel,
      hiringProcessTitle,
      hiringProcess,
    });

    if (existingData) {
      return next(new appError("Career info already exists", 400));
    }
    // validate data

    const validateData = await careerInfoSchema.parse({
      badgeText,
      heroTitle,
      heroHighlight,
      heroDescription,

      benefitsLabel,
      benefitsTitle,
      employeeBenefits,

      cultureTitle,
      cultureDescription,
      culturePoints,

      hiringProcessLabel,
      hiringProcessTitle,
      hiringProcess,
    });

    // create
    const createCareerInfo = await CareerInfo.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Career info created successfully",
      data: createCareerInfo,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCareerInfoData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await CareerInfo.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Career info retrieved successfully"
          : "No Career Enquiry found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCareerInfoById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const CareerInfoId = await CareerInfo.findOne({
      _id: req.params.id,
    });

    if (!CareerInfoId) {
      next(new appError("Career info not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Career info retrieved successfully",
      data: CareerInfoId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCareerInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careerInfoId = req.params.id;

    // validate
    const validateData = await updatecareerInfoSchema.parse(req.body);

    const UpdateCareerinfo = await CareerInfo.findOneAndUpdate(
      { _id: careerInfoId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateCareerinfo) {
      return next(new appError("Career info not found", 404));
    }

    await UpdateCareerinfo.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Career info updated successfully",
      data: UpdateCareerinfo,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCareerInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteCareerinfo = await CareerInfo.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteCareerinfo) {
      return next(new appError("Career info not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Career info deleted successfully",
      data: deleteCareerinfo,
    });
    return;
  } catch (error) {
    next(error);
  }
};
