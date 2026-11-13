import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Certificates } from "./certificates.model";
import {
  certificatesSchema,
  updateCertificatesSchema,
} from "./certificates.validation";

export const createCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const certificatesImage = req.file?.path;

    if (!certificatesImage) {
      return next(new Error("certificates Image is required"));
    }

    const existingData = await Certificates.findOne({ certificatesImage });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    const validateData = await certificatesSchema.parse({ certificatesImage });

    const createCertificates = await Certificates.create(validateData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Certificates created successfully",
      data: createCertificates,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allCertificates = await Certificates.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Certificates retrieved successfully",
      data: allCertificates,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getCertificatesById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const certificatesById = await Certificates.findOne({
      _id: req.params.id,
    });

    if (!certificatesById) {
      next(new appError("Client not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Client retrieved successfully",
      data: certificatesById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const CertificatesId = req.params.id;

    const validateData: any = await updateCertificatesSchema.parse(req.body);

    if (req.file) {
      validateData.certificatesImage = (req.file as any).path;
      // or req.file.secure_url depending on your cloudinary setup
    }

    const updatedCertificate = await Certificates.findByIdAndUpdate(
      CertificatesId,
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedCertificate) {
      return next(new appError("Certificates not found", 404));
    }

    res.json({
      success: true,
      statusCode: 200,
      message: "Certificates updated successfully",
      data: updatedCertificate,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCertificates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteCertificates = await Certificates.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!deleteCertificates) {
      return next(new appError("Client not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Certificates deleted successfully",
      data: deleteCertificates,
    });
    return;
  } catch (error) {
    next(error);
  }
};
