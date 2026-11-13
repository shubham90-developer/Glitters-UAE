import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { ReturnPolicy } from "./returnPolicy.model";
import {
  returnPolicySchema,
  updateReturnPolicySchema,
} from "./returnPolicy.validation";

export const createReturnPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      badgeTitle,
      title,
      shortDesc,

      startReturnBtnText,
      startReturnBtnUrl,

      contactSupportBtnText,
      contactSupportBtnUrl,

      features,

      howItWorksTitle,
      howItWorksDesc,
      returnSteps,

      eligibleTitle,
      eligibleDesc,
      eligibleItems,

      nonReturnableTitle,
      nonReturnableDesc,
      nonReturnableItems,

      refundTimelineTitle,
      refundTimelineDesc,
      refundTimeline,

      refundProcessingTitle,
      refundProcessingDesc,
    } = req.body;

    // Check if return policy already exists
    const existingData = await ReturnPolicy.findOne({
      isDeleted: false,
    });

    if (existingData) {
      return next(
        new appError(
          "Return Policy already exists. Please update the existing Return Policy.",
          400,
        ),
      );
    }

    // Validate data
    const validateData = returnPolicySchema.parse({
      badgeTitle,
      title,
      shortDesc,

      startReturnBtnText,
      startReturnBtnUrl,

      contactSupportBtnText,
      contactSupportBtnUrl,

      features,

      howItWorksTitle,
      howItWorksDesc,
      returnSteps,

      eligibleTitle,
      eligibleDesc,
      eligibleItems,

      nonReturnableTitle,
      nonReturnableDesc,
      nonReturnableItems,

      refundTimelineTitle,
      refundTimelineDesc,
      refundTimeline,

      refundProcessingTitle,
      refundProcessingDesc,
    });

    // Create return policy
    const createdReturnPolicy = await ReturnPolicy.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Return Policy created successfully",
      data: createdReturnPolicy,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllReturnPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllReturnPolicyData = await ReturnPolicy.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllReturnPolicyData.length > 0
          ? "Return Policy retrieved successfully"
          : "No Return Policy found",
      data: getAllReturnPolicyData,
    });
  } catch (error) {
    next(error);
  }
};

export const getReturnPolicyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ReturnPolicyId = await ReturnPolicy.findOne({
      _id: req.params.id,
    });

    if (!ReturnPolicyId) {
      return next(new appError("Return Policy not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Return Policy retrieved successfully",
      data: ReturnPolicyId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateReturnPolicy = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const ReturnPolicyId = req.params.id;

    // validate
    const validateData = await updateReturnPolicySchema.parse(req.body);

    const UpdateReturnPolicy = await ReturnPolicy.findOneAndUpdate(
      { _id: ReturnPolicyId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateReturnPolicy) {
      return next(new appError("ReturnPolicynot found", 404));
    }

    await UpdateReturnPolicy.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Return Policy updated successfully",
      data: UpdateReturnPolicy,
    });
  } catch (error) {
    next(error);
  }
};
