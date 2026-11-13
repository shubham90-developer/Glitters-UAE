import { NextFunction, Request, Response } from "express";
import { Counter } from "./counter.model";
import { appError } from "../../errors/appError";
import { counterSchema, updateCounterSchema } from "./counter.validation";

export const createCounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      subTitle,
      happyCustomers,
      products,
      ordersDelivered,
      customerRating,
    } = req.body;

    // existing
    const existingData = await Counter.findOne({
      title,
      subTitle,
      happyCustomers,
      products,
      ordersDelivered,
      customerRating,
    });

    if (existingData) {
      return next(new appError("Data already exists", 400));
    }
    // validate data

    const validateData = await counterSchema.parse({
      title,
      subTitle,
      happyCustomers,
      products,
      ordersDelivered,
      customerRating,
    });

    // create
    const createCounter = await Counter.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Counter created successfully",
      data: createCounter,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCounterData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Counter.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Counter retrieved successfully"
          : "No counter found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCounter = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const counterId = req.params.id;

    // validate
    const validateData = await updateCounterSchema.parse(req.body);

    const UpdateCounter = await Counter.findOneAndUpdate(
      { _id: counterId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateCounter) {
      return next(new appError("Counter not found", 404));
    }

    await UpdateCounter.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Counter updated successfully",
      data: UpdateCounter,
    });
  } catch (error) {
    next(error);
  }
};
