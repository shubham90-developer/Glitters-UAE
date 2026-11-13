import { NextFunction, Request, Response } from "express";
import { appError } from "../../errors/appError";
import { Contact } from "./contacts.model";
import { contactSchema, updateContactSchema } from "./contacts.validation";

export const createContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      firstName,
      lastName,
      emailAddress,
      phone,
      subject,
      orderNo,
      message,
      status,
    } = req.body;

    // Check existing contact
    const existingData = await Contact.findOne({
      emailAddress,
      subject,
      message,
      isDeleted: false,
    });

    if (existingData) {
      return next(new appError("Contact enquiry already exists", 400));
    }

    // Validate data
    const validateData = contactSchema.parse({
      firstName,
      lastName,
      emailAddress,
      phone,
      subject,
      orderNo,
      message,
      status,
    });

    // Create contact
    const createdContact = await Contact.create(validateData);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Contact enquiry created successfully",
      data: createdContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllContactData = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "Contact retrieved successfully"
          : "No Contact found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contactId = await Contact.findOne({
      _id: req.params.id,
    });

    if (!contactId) {
      next(new appError("Contact not found", 404));
      return;
    }
    res.json({
      success: true,
      statusCode: 200,
      message: "Contact retrieved successfully",
      data: contactId,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const FaqId = req.params.id;

    // validate
    const validateData = await updateContactSchema.parse(req.body);

    const UpdateContact = await Contact.findOneAndUpdate(
      { _id: FaqId },
      validateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!UpdateContact) {
      return next(new appError("Contact not found", 404));
    }

    await UpdateContact.save();

    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Contact updated successfully",
      data: UpdateContact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleteContact = await Contact.findOneAndDelete({
      _id: req.params.id,
    });
    if (!deleteContact) {
      return next(new appError("Contact not found", 404));
    }
    res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Contact deleted successfully",
      data: deleteContact,
    });
    return;
  } catch (error) {
    next(error);
  }
};
