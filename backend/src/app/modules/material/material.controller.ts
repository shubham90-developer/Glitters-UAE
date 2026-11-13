import { NextFunction, Request, Response } from "express";
import { Material } from "./material.model";
import { appError } from "../../errors/appError";
import { materialSchema, updateMaterialSchema } from "./material.validation";

export const createMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, status } = req.body;

    // existing
    const existingData = await Material.findOne({
      name,
      status,
    });

    if (existingData) {
      return next(new appError("Material already exists", 400));
    }
    // validate data

    const validateData = await materialSchema.parse({
      name,
      status,
    });

    // create
    const createMaterial = await Material.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 200,
      message: "Material created successfully",
      data: createMaterial,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllMaterialData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Material.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Material retrieved successfully"
          : "No Material found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getMaterialById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const MaterialById = await Material.findOne({
      _id: req.params.id,
    });

    if (!MaterialById) {
      next(new appError("Material not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Material retrieved successfully",
      data: MaterialById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const MaterialId = req.params.id;

    // validate
    const validateData = await updateMaterialSchema.parse(req.body);

    const UpdateMaterial = await Material.findOneAndUpdate(
      { _id: MaterialId },
      validateData,
      { new: true, runValidators: true },
    );

    if (!UpdateMaterial) {
      return next(new appError("Material not found", 404));
    }

    await UpdateMaterial.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Material updated successfully",
      data: UpdateMaterial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMaterial = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const material = await Material.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!material) {
      return next(new appError("Material not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Material deleted successfully",
      data: material,
    });
    return;
  } catch (error) {
    next(error);
  }
};
