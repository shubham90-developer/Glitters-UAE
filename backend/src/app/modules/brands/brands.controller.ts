import { NextFunction, Request, Response } from "express";
import { Brands } from "./brands.model";
import { appError } from "../../errors/appError";
import { brandsSchema, updateBrandsSchema } from "./brands.validation";

export const createBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, status } = req.body;

    // existing
    const existingData = await Brands.findOne({
      name,
      status,
    });

    if (existingData) {
      return next(new appError("Brands already exists", 400));
    }
    // validate data

    const validateData = await brandsSchema.parse({
      name,
      status,
    });

    // create
    const createBrands = await Brands.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Brands created successfully",
      data: createBrands,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBrandsData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Brands.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Brands retrieved successfully"
          : "No Brands found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getBrandsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brandsById = await Brands.findOne({
      _id: req.params.id,
    });

    if (!brandsById) {
      next(new appError("Brands not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Brands retrieved successfully",
      data: brandsById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const BrandsId = req.params.id;

    // validate
    const validateData = await updateBrandsSchema.parse(req.body);

    const UpdateBrands = await Brands.findOneAndUpdate(
      { _id: BrandsId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateBrands) {
      return next(new appError("Brands not found", 404));
    }

    await UpdateBrands.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Brands updated successfully",
      data: UpdateBrands,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBrands = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const brands = await Brands.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!brands) {
      return next(new appError("Brands not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Brands deleted successfully",
      data: brands,
    });
    return;
  } catch (error) {
    next(error);
  }
};
