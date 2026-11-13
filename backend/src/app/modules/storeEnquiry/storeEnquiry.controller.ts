import { NextFunction, Request, Response } from "express";

import { appError } from "../../errors/appError";

import { StoreEnquiry } from "./storeEnquiry.model";
import { storeEnquirySchema } from "./storeEnquiry.validation";

export const createStoreEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { storeName, fullName, phone, email, msg } = req.body;

    // existing
    const existingStoreEnquiry = await StoreEnquiry.findOne({
      storeName,
      fullName,
      phone,
      email,
      msg,
    });

    if (existingStoreEnquiry) {
      return next(new appError("Store Enquiry already exists", 400));
    }

    const validateData = storeEnquirySchema.parse({
      storeName,
      fullName,
      phone,
      email,
      msg,
    });

    const storeEnquiry = await (
      await StoreEnquiry.create(validateData)
    ).populate("storeName");

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "store Enquiry created successfully",
      data: storeEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStoreEnquiry = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeEnquiry = await StoreEnquiry.find({
      isDeleted: false,
    })
      .populate("storeName", "_id storeName")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        storeEnquiry.length > 0
          ? "Store enquiries retrieved successfully"
          : "No store enquiry found",
      data: storeEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const StoreEnquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeEnquiry = await StoreEnquiry.findOne({
      _id: req.params.id,
    });

    if (!storeEnquiry) {
      next(new appError("store enquiry not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "store enquiry retrieved successfully",
      data: storeEnquiry,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStoreEnquiryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const storeEnquiry = await StoreEnquiry.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!storeEnquiry) {
      next(new appError("store Enquiry not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "store Enquiry deleted successfully",
      data: storeEnquiry,
    });
  } catch (error) {
    next(error);
  }
};
