import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Testimonials } from "./testimonials.model";
import {
  testimonialSchema,
  updatetestimonialSchema,
} from "./testimonials.validation";
import { cloudinary } from "../../config/cloudinary";

export const createTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { name, designation, description, rating } = req.body;
    const image = req.file?.path;

    if (!image) {
      return next(new Error("Image is required"));
    }

    // existing
    const existingData = await Testimonials.findOne({
      name,
      designation,
      description,
      rating,
      image,
    });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    // validate data
    const validateData = await testimonialSchema.parse({
      name,
      designation,
      description,
      rating,
      image,
    });

    // create
    const createTestimonials = await Testimonials.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Testimonials created successfully",
      data: createTestimonials,
    });
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split("/").pop()?.split(".")[0];

      if (publicId) {
        await cloudinary.uploader.destroy(`testimonials/${publicId}`);
      }
    }
    next(error);
  }
};

export const getAllTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const testimonials = await Testimonials.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      statusCode: 200,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const testimonilasById = await Testimonials.findOne({
      _id: req.params.id,
    });

    if (!testimonilasById) {
      next(new appError("Testimonials not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Testimonials retrieved successfully",
      data: testimonilasById,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const testimonialsId = req.params.id;

    const validatedData = updatetestimonialSchema.parse(req.body);

    const existingTestimonial = await Testimonials.findById(testimonialsId);

    if (!existingTestimonial) {
      return next(new appError("Testimonials not found", 404));
    }

    // Upload new image if selected
    if (req.file?.path) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "testimonials",
      });

      validatedData.image = uploadResult.secure_url;

      // Delete old image
      if (existingTestimonial.image) {
        const publicId = existingTestimonial.image
          .split("/")
          .pop()
          ?.split(".")[0];

        if (publicId) {
          await cloudinary.uploader.destroy(`testimonials/${publicId}`);
        }
      }
    }

    const updatedTestimonial = await Testimonials.findByIdAndUpdate(
      testimonialsId,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Testimonials updated successfully",
      data: updatedTestimonial,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTestimonials = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteTestimonials = await Testimonials.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!deleteTestimonials) {
      return next(new appError("Testimonials not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Testimonials deleted successfully",
      data: deleteTestimonials,
    });

    return;
  } catch (error) {
    next(error);
  }
};
