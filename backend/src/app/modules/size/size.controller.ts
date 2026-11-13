import { NextFunction, Request, Response } from "express";
import { Size } from "./size.model";
import { appError } from "../../errors/appError";
import { sizeSchema, updateSizeSchema } from "./size.validation";

export const createSize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { size, status } = req.body;

    // existing
    const existingData = await Size.findOne({
      size,
      status,
    });

    if (existingData) {
      return next(new appError("Size already exists", 400));
    }
    // validate data

    const validateData = await sizeSchema.parse({
      size,
      status,
    });

    // create
    const createSize = await Size.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Size created successfully",
      data: createSize,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSizeData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Size.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0 ? "Size retrieved successfully" : "No Size found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getSizeById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SizeById = await Size.findOne({
      _id: req.params.id,
    });

    if (!SizeById) {
      next(new appError("Size not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Size retrieved successfully",
      data: SizeById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateSize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const SizeId = req.params.id;

    // validate
    const validateData = await updateSizeSchema.parse(req.body);

    const UpdateSize = await Size.findOneAndUpdate(
      { _id: SizeId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateSize) {
      return next(new appError("Size not found", 404));
    }

    await UpdateSize.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Size updated successfully",
      data: UpdateSize,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSize = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const size = await Size.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!size) {
      return next(new appError("Size not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Size deleted successfully",
      data: size,
    });
    return;
  } catch (error) {
    next(error);
  }
};
