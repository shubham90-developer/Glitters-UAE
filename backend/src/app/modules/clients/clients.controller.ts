import { NextFunction, Request, Response } from "express";
import { Client } from "./clients.model";
import { clientsSchema } from "./clinets.validation";
import { appError } from "../../errors/appError";

export const createClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const logo = req.file?.path;

    if (!logo) {
      return next(new Error("Logo is required"));
    }

    const existingData = await Client.findOne({ logo });

    if (existingData) {
      return next(new Error("Data already exists"));
    }

    const validateData = await clientsSchema.parse({ logo });

    const createClients = await Client.create(validateData);

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Clients created successfully",
      data: createClients,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getAllClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allClients = await Client.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Clients retrieved successfully",
      data: allClients,
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
    const clientById = await Client.findOne({
      _id: req.params.id,
    });

    if (!clientById) {
      next(new appError("Client not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Client retrieved successfully",
      data: clientById,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clientsId = req.params.id;

    const updateData: any = { ...req.body };

    // uploaded logo
    if (req.file) {
      updateData.logo = req.file.path; // cloudinary/local path
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientsId,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedClient) {
      return next(new appError("Client not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clients = await Client.findOneAndDelete(
      {
        _id: req.params.id,
      },
      { new: true },
    );

    if (!clients) {
      return next(new appError("Client not found", 404));
    }

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Client deleted successfully",
      data: clients,
    });
    return;
  } catch (error) {
    next(error);
  }
};
