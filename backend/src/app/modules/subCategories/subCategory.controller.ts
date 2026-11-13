import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { SubCategory } from "./subCategory.model";
import {
  subCategorySchema,
  updateSubCategorySchema,
} from "./subCategory.validation";

// =========================
// CREATE SUB CATEGORY
// =========================
export const createSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { category, subCategoryName, status } = req.body;

    const img = req.file?.path;

    if (!img) {
      return next(new appError("Sub category image is required", 400));
    }

    // Check duplicate under same category
    const existingData = await SubCategory.findOne({
      category,
      subCategoryName,
      isDeleted: false,
    });

    if (existingData) {
      return next(
        new appError("Sub category already exists in this category", 400),
      );
    }

    const validateData = subCategorySchema.parse({
      category,
      img,
      subCategoryName,
      status,
    });

    const subCategory = (await SubCategory.create(validateData)).populate(
      "category",
    );

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Sub category created successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET ALL SUB CATEGORIES
// =========================
export const getAllSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allSubCategory = await SubCategory.find({
      isDeleted: false,
    })
      .populate("category", "categoryName categoryDesc img status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        allSubCategory.length > 0
          ? "Sub categories retrieved successfully"
          : "No sub categories found",
      data: allSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// GET SUB CATEGORY BY ID
// =========================
export const getSubCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subCategory = await SubCategory.findOne({
      _id: req.params.id,
      isDeleted: false,
    }).populate("category", "categoryName categoryDesc img status");

    if (!subCategory) {
      return next(new appError("Sub category not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sub category retrieved successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// UPDATE SUB CATEGORY
// =========================
export const updateSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subCategoryId = req.params.id;

    const existingSubCategory = await SubCategory.findById(subCategoryId);

    if (!existingSubCategory) {
      return next(new appError("Sub category not found", 404));
    }

    const { category, subCategoryName, status, isDeleted } = req.body;

    const updateData: {
      category?: string;
      img?: string;
      subCategoryName?: string;
      status?: "active" | "inactive";
      isDeleted?: boolean;
    } = {};

    if (category !== undefined) {
      updateData.category = category;
    }

    if (subCategoryName !== undefined) {
      updateData.subCategoryName = subCategoryName;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted === true || isDeleted === "true";
    }

    if (req.file?.path) {
      updateData.img = req.file.path;
    }

    // Check duplicate if category/name is being changed
    const duplicateCategory =
      category ?? existingSubCategory.category.toString();

    const duplicateName =
      subCategoryName ?? existingSubCategory.subCategoryName;

    const duplicateData = await SubCategory.findOne({
      _id: { $ne: subCategoryId },
      category: duplicateCategory,
      subCategoryName: duplicateName,
      isDeleted: false,
    });

    if (duplicateData) {
      return next(
        new appError("Sub category already exists in this category", 400),
      );
    }

    const validatedData = updateSubCategorySchema.parse(updateData);

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    ).populate("category", "categoryName categoryDesc img status");

    if (!updatedSubCategory) {
      return next(new appError("Sub category not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sub category updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// DELETE SUB CATEGORY
// =========================
export const deleteSubCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return next(new appError("Sub category not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Sub category deleted successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};
