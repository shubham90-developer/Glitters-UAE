import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";

import { cloudinary } from "../../config/cloudinary";
import { ReturnRequest } from "./returnRequest.model";
import { returnRequestSchema } from "./returnRequest.validation";
import { updatecareerEnquirySchema } from "../careersEnquiry/careerEnquiry.validation";

export const createReturnRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      orderNumber,
      emailAddress,
      product,
      reason,
      additionalDetails,
      isConfirmed,
    } = req.body;

    // Check duplicate pending request for same order/product
    const existingData = await ReturnRequest.findOne({
      orderNumber,
      emailAddress,
      product,
      isDeleted: false,
      status: "pending",
    });

    if (existingData) {
      return next(
        new appError(
          "A pending return request already exists for this order and product",
          400,
        ),
      );
    }

    // Validate request data
    const validateData = returnRequestSchema.parse({
      orderNumber,
      emailAddress,
      product,
      reason,
      additionalDetails,
      isConfirmed,
    });

    // Create return request
    const returnRequest = await ReturnRequest.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Return request created successfully",
      data: returnRequest,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCareerEnquiryData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await ReturnRequest.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "return request retrieved successfully"
          : "No Career Enquiry found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getReturnRequestById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const returnRequestId = await ReturnRequest.findOne({
      _id: req.params.id,
    });

    if (!returnRequestId) {
      next(new appError("Return Request not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Return Request retrieved successfully",
      data: returnRequestId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateReturnRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const careerEnquiryId = req.params.id;

    // validate
    const validateData = await updatecareerEnquirySchema.parse(req.body);

    const updateReturnRequest = await ReturnRequest.findOneAndUpdate(
      { _id: careerEnquiryId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateReturnRequest) {
      return next(new appError("ReturnRequestnot found", 404));
    }

    await updateReturnRequest.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "return request updated successfully",
      data: updateReturnRequest,
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

export const deleteReturnRequest = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const DeleteReturnRequest = await ReturnRequest.findOneAndDelete({
      _id: req.params.id,
    });
    if (!DeleteReturnRequest) {
      return next(new appError("return request not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "return request deleted successfully",
      data: DeleteReturnRequest,
    });
    return;
  } catch (error) {
    next(error);
  }
};
