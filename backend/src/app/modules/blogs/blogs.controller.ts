import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { cloudinary } from "../../config/cloudinary";
import { BlogsModel } from "./blogs.model";
import { blogsSchemaSchema, blogsSchemaUpdateSchema } from "./blogs.validation";

export const createBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      category,
      title,
      shortDesc,
      author,
      featured,
      description,
      QuickTips,
      blackQuote,
      tags,
      writtenBy,
      writtenByDesc,
      metaTitle,
      metaDesc,
      metaTags,
      status,
      isDeleted,
    } = req.body;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const image = files?.image?.[0]?.path;
    const writtenByImage = files?.writtenByImage?.[0]?.path;

    if (!image) {
      return next(new appError("Blog image is required", 400));
    }

    // =========================
    // CHECK EXISTING BLOG
    // =========================
    const existingBlog = await BlogsModel.findOne({
      title,
      isDeleted: false,
    });

    if (existingBlog) {
      return next(new appError("Blog already exists", 400));
    }

    // =========================
    // VALIDATE
    // =========================
    const validateData = blogsSchemaSchema.parse({
      category,
      title,
      shortDesc,
      author,
      featured,
      image,
      description,
      QuickTips,
      blackQuote,
      tags,
      writtenBy,
      writtenByImage,
      writtenByDesc,
      metaTitle,
      metaDesc,
      metaTags,
      status,
      isDeleted,
    });

    // =========================
    // CREATE
    // =========================
    const blog = (await BlogsModel.create(validateData)).populate("category");

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (error) {
    // Optional: remove uploaded files on failed create

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    if (files?.image?.[0]) {
      const publicId = files.image[0].filename;

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    if (files?.writtenByImage?.[0]) {
      const publicId = files.writtenByImage[0].filename;

      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    next(error);
  }
};

export const getAllBlogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Storefront sends ?status=active -> hide inactive blogs.
    // Admin sends no status -> still sees everything.
    const filter: Record<string, any> = { isDeleted: false };

    if (req.query.status === "active") {
      filter.status = { $ne: "inactive" };
    } else if (req.query.status === "inactive") {
      filter.status = "inactive";
    }

    const Blogs = await BlogsModel.find(filter)
      .populate("category", "_id categoryName createdAt updatedAt")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        Blogs.length > 0 ? "Blogs retrieved successfully" : "No Blogs found",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const BlogsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter: Record<string, any> = {
      _id: req.params.id,
      isDeleted: false,
    };

    // Storefront sends ?status=active -> inactive blog returns 404
    if (req.query.status === "active") {
      filter.status = { $ne: "inactive" };
    }

    const Blogs = await BlogsModel.findOne(filter).populate(
      "category",
      "_id categoryName createdAt updatedAt",
    );
    if (!Blogs) {
      next(new appError("Blogs not found", 404));
      return;
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blogs retrieved successfully",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const blogId = req.params.id;

    // =========================
    // VALIDATE BODY
    // =========================
    const validatedData = blogsSchemaUpdateSchema.parse(req.body);

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const updatePayload: Record<string, any> = {
      ...validatedData,
    };

    // =========================
    // IMAGE
    // =========================
    if (files?.image?.[0]?.path) {
      updatePayload.image = files.image[0].path;
    }

    // =========================
    // WRITTEN BY IMAGE
    // =========================
    if (files?.writtenByImage?.[0]?.path) {
      updatePayload.writtenByImage = files.writtenByImage[0].path;
    }

    // =========================
    // UPDATE BLOG
    // =========================
    const updatedBlog = await BlogsModel.findOneAndUpdate(
      {
        _id: blogId,
        isDeleted: false,
      },
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    ).populate("category", "title");

    if (!updatedBlog) {
      return next(new appError("Blog not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlogsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Blogs = await BlogsModel.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!Blogs) {
      next(new appError("Blogs not found", 404));
      return;
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Blogs deleted successfully",
      data: Blogs,
    });
  } catch (error) {
    next(error);
  }
};
