import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { CareerEnquiry } from "./careerEnquiry.model";
import {
  careerEnquirySchema,
  updatecareerEnquirySchema,
} from "./careerEnquiry.validation";
import { cloudinary } from "../../config/cloudinary";

export const createCareerEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phone,
      currentPosition,
      experience,
      currentLocation,
      expectedSalary,
      linkedIn,
      coverLetter,
      message,
    } = req.body;
    const resume = req.file?.path;
    if (!resume) {
      return next(new appError("Resume is required", 400));
    }
    // existing
    const existingData = await CareerEnquiry.findOne({
      firstName,
      lastName,
      emailAddress,
      phone,
      currentPosition,
      experience,
      currentLocation,
      expectedSalary,
      linkedIn,
      coverLetter,
      message,
      resume,
    });

    if (existingData) {
      return next(new appError("Career Enquiry already exists", 400));
    }
    // validate data

    const validateData = await careerEnquirySchema.parse({
      firstName,
      lastName,
      emailAddress,
      phone,
      currentPosition,
      experience,
      currentLocation,
      expectedSalary,
      linkedIn,
      coverLetter,
      message,
      resume,
    });

    // create
    const createCareerEnquiry = await CareerEnquiry.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "CareerEnquiry created successfully",
      data: createCareerEnquiry,
    });
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`enquiries-careers/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllCareerEnquiryData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await CareerEnquiry.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Career Enquiry retrieved successfully"
          : "No Career Enquiry found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCareerEnquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const CareerEnquiryId = await CareerEnquiry.findOne({
      _id: req.params.id,
    });

    if (!CareerEnquiryId) {
      next(new appError("Career Enquiry not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Career Enquiry retrieved successfully",
      data: CareerEnquiryId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCareerEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careerEnquiryId = req.params.id;

    // validate
    const validateData = await updatecareerEnquirySchema.parse(req.body);

    const UpdateCareerEnquiry = await CareerEnquiry.findOneAndUpdate(
      { _id: careerEnquiryId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateCareerEnquiry) {
      return next(new appError("CareerEnquiry not found", 404));
    }

    await UpdateCareerEnquiry.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Career Enquiry updated successfully",
      data: UpdateCareerEnquiry,
    });
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`enquiries-careers/${publicId}`);
      }
    }
    next(error);
  }
};

export const deleteCareerEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteCareerEnquiry = await CareerEnquiry.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteCareerEnquiry) {
      return next(new appError("Career Enquiry not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Career Enquiry deleted successfully",
      data: deleteCareerEnquiry,
    });
    return;
  } catch (error) {
    next(error);
  }
};
