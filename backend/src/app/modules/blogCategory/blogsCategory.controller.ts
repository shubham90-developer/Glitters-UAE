import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";

import { BlogsCategoryModel } from "./blogsCategory.model";
import { blogsCategorySchemaSchema } from "./blogsCategory.validation";

export const createBlogsCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { categoryName, status } = req.body;

    // existing
    const exixtingBlogsCategory = await BlogsCategoryModel.findOne({
      categoryName,
      status,
    });

    if (exixtingBlogsCategory) {
      return next(new appError("Blogs Category already exists", 400));
    }

    const validateData = blogsCategorySchemaSchema.parse({
      categoryName,
      status,
    });

    const BlogsCategory = await BlogsCategoryModel.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Blogs Category created successfully",
      data: BlogsCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogsCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Blogs = await BlogsCategoryModel.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        Blogs.length > 0
          ? "Blogs Category retrieved successfully"
          : "No Blogs found",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const BlogsCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Blogs = await BlogsCategoryModel.findOne({
      _id: req.params.id,
    });

    if (!Blogs) {
      next(new appError("Blogs Category not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Blogs Category retrieved successfully",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogsCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const BlogsId = req.params.id;

    const validatedData = blogsCategorySchemaSchema.parse(req.body);

    const updateBlogs = await BlogsCategoryModel.findByIdAndUpdate(
      BlogsId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updateBlogs) {
      return next(new appError("Blog Category not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Blog Category updated successfully",
      data: updateBlogs,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogsCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Blogs = await BlogsCategoryModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!Blogs) {
      next(new appError("Blogs Category not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Blogs Category deleted successfully",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};
