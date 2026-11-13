import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Coupons } from "./coupons.model";
import { couponsSchema, updateCouponsSchema } from "./coupons.validation";

export const createCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { couponName, subTitle, couponCode, couponAmount, status } = req.body;

    // existing
    const existingData = await Coupons.findOne({
      couponName,
      subTitle,
      couponCode,
      couponAmount,
      status,
    });

    if (existingData) {
      return next(new appError("Coupons already exists", 400));
    }
    // validate data

    const validateData = await couponsSchema.parse({
      couponName,
      subTitle,
      couponCode,
      couponAmount,
      status,
    });

    // create
    const createCoupons = await Coupons.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Coupons created successfully",
      data: createCoupons,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCouponsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Coupons.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Coupons retrieved successfully"
          : "No Coupons found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getCouponsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const CouponsById = await Coupons.findOne({
      _id: req.params.id,
    });

    if (!CouponsById) {
      next(new appError("Coupons not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Coupons retrieved successfully",
      data: CouponsById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const CouponsId = req.params.id;

    // validate
    const validateData = await updateCouponsSchema.parse(req.body);

    const UpdateCoupons = await Coupons.findOneAndUpdate(
      { _id: CouponsId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateCoupons) {
      return next(new appError("Coupons not found", 404));
    }

    await UpdateCoupons.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Coupons updated successfully",
      data: UpdateCoupons,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCoupons = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const coupons = await Coupons.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!coupons) {
      return next(new appError("Coupons not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Coupons deleted successfully",
      data: coupons,
    });
    return;
  } catch (error) {
    next(error);
  }
};
