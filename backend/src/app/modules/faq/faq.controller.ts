import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { FaqModel } from "./faq.model";
import { faqSchema, updateFaqSchema } from "./faq.validation";

export const createFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, question, answer, status } = req.body;

    // Check existing FAQ
    const existingData = await FaqModel.findOne({
      category,
      question,
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("FAQ already exists", 400));
    }

    // Validate data
    const validateData = faqSchema.parse({
      category,
      question,
      answer,
      status,
    });

    // Create FAQ
    const createdFaq = await FaqModel.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "FAQ created successfully",
      data: createdFaq,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFaqData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await FaqModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0 ? "Faq retrieved successfully" : "No Faq found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const faqId = await FaqModel.findOne({
      _id: req.params.id,
    });

    if (!faqId) {
      next(new appError("Faq not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Faq retrieved successfully",
      data: faqId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const FaqId = req.params.id;

    // validate
    const validateData = await updateFaqSchema.parse(req.body);

    const UpdateFaq = await FaqModel.findOneAndUpdate(
      { _id: FaqId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateFaq) {
      return next(new appError("Faq not found", 404));
    }

    await UpdateFaq.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Faq updated successfully",
      data: UpdateFaq,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFaq = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const faq = await FaqModel.findOneAndDelete({
      _id: req.params.id,
    });
    if (!faq) {
      return next(new appError("Faq not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Faq deleted successfully",
      data: faq,
    });
    return;
  } catch (error) {
    next(error);
  }
};
