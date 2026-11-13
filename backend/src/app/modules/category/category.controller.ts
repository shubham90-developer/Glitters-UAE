import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Category } from "./category.model";
import { categorySchema, updateCategorySchema } from "./category.validation";

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName, categoryDesc, status } = req.body;

    const img = req.file?.path;

    if (!img) {
      return next(new appError("Category image is required", 400));
    }

    // Check existing category by name
    const existingData = await Category.findOne({
      categoryName,
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("Category already exists", 400));
    }

    // Validate data
    const validateData = categorySchema.parse({
      img,
      categoryName,
      categoryDesc,
      status,
    });

    // Create category
    const createdCategory = await Category.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Category created successfully",
      data: createdCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allCategory = await Category.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Category retrieved successfully",
      data: allCategory,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryById = await Category.findOne({
      _id: req.params.id,
    });

    if (!categoryById) {
      next(new appError("category not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "category retrieved successfully",
      data: categoryById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryId = req.params.id;

    const existingCategory = await Category.findById(categoryId);

    if (!existingCategory) {
      return next(new appError("Category not found", 404));
    }

    const updateData: {
      img?: string;
      categoryName?: string;
      categoryDesc?: string;
      status?: "active" | "inactive";
      isDeleted?: boolean;
    } = {};

    const { categoryName, categoryDesc, status, isDeleted } = req.body;

    if (categoryName !== undefined) {
      updateData.categoryName = categoryName;
    }

    if (categoryDesc !== undefined) {
      updateData.categoryDesc = categoryDesc;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (isDeleted !== undefined) {
      updateData.isDeleted = isDeleted === true || isDeleted === "true";
    }

    // New category image
    if (req.file?.path) {
      updateData.img = req.file.path;
    }

    // Validate update data
    const validatedData = updateCategorySchema.parse(updateData);

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCategory) {
      return next(new appError("Category not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const category = await Category.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!category) {
      return next(new appError("category not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "category deleted successfully",
      data: category,
    });
    return;
  } catch (error) {
    next(error);
  }
};
