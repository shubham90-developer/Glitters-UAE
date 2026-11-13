import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";

import { appError } from "../../errors/appError";
import { AppSettings } from "./app-settings.model";
import { appSettingsValidation } from "./app-settings.validation";

export const createAppSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const payload: Record<string, any> = {
      ...req.body,
    };

    // Handle uploaded files
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (files.applogo?.[0]?.path) {
        payload.applogo = files.applogo[0].path;
      }

      if (files.footerImg?.[0]?.path) {
        payload.footerImg = files.footerImg[0].path;
      }
    }

    // Check existing settings
    const existingSettings = await AppSettings.findOne();

    if (existingSettings) {
      return next(
        new appError(
          "App settings already exist. Please update existing settings.",
          400,
        ),
      );
    }

    // Validate
    const validatedData = appSettingsValidation.parse(payload);

    // Create
    const settings = await AppSettings.create(validatedData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "App settings created successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllAppSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await AppSettings.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: "App settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const getAppSettingsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await AppSettings.findById(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "App settings not found",
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "App settings retrieved successfully",
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAppSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Settings ID is required",
      });
    }

    // Check existing record
    const existingSettings = await AppSettings.findById(id);

    if (!existingSettings) {
      return res.status(404).json({
        success: false,
        message: "App settings not found",
      });
    }

    const payload: any = {
      ...req.body,
    };

    // Handle files
    if (req.files) {
      const files = req.files as Record<string, Express.Multer.File[]>;

      if (files.applogo?.[0]) {
        payload.applogo = files.applogo[0].path;
      }

      if (files.footerImg?.[0]) {
        payload.footerImg = files.footerImg[0].path;
      }
    }

    // Validate only provided fields
    const validatedData = appSettingsValidation.partial().parse(payload);

    // Hash password if provided
    if (validatedData.password) {
      validatedData.password = await bcrypt.hash(validatedData.password, 10);
    }

    delete (validatedData as any).confirmPassword;

    const updatedSettings = await AppSettings.findByIdAndUpdate(
      id,
      validatedData,
      {
        new: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "App settings updated successfully",
      data: updatedSettings,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAppSettings = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const settings = await AppSettings.findByIdAndDelete(req.params.id);

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "App settings not found",
      });
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "App settings deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
