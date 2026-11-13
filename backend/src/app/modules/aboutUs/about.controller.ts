import { NextFunction, Request, Response } from "express";
import { AboutUs } from "./about.model";
import { aboutUsSchema, aboutUsUpdateSchema } from "./about.validation";
import { appError } from "../../errors/appError";

export const createAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      // =========================
      // HERO / ABOUT SECTION
      // =========================
      title,
      subTitle,
      shortDesc,
      ProductsCounter,
      CustomersCounter,
      DeliveriesCounter,
      Rating,
      trustedTitle,
      trustedDesc,

      // =========================
      // OUR STORY SECTION
      // =========================
      storySubTitle,
      storyTitle,
      storyDesc,
      storySecondDesc,

      customerFirstTitle,
      customerFirstDesc,

      qualityFocusTitle,
      qualityFocusDesc,

      transparentPricingTitle,
      transparentPricingDesc,

      reliableSupportTitle,
      reliableSupportDesc,

      // =========================
      // OUR VALUES
      // =========================
      valuesTitle,
      valuesSubTitle,

      CustomerFirstTitle,
      CustomerFirstDesc,

      TrustSecurityTitle,
      TrustSecurityDesc,

      QualityTitle,
      QualityDesc,

      ContinuousImprovementTitle,
      ContinuousImprovementDesc,

      // =========================
      // WHY SHOP WITH US
      // =========================
      whyShopSubTitle,
      whyShopTitle,
      whyShopDesc,

      wideSelectionTitle,
      wideSelectionDesc,

      fastDeliveryTitle,
      fastDeliveryDesc,

      secureCheckoutTitle,
      secureCheckoutDesc,

      easyReturnsTitle,
      easyReturnsDesc,

      // =========================
      // OUR PROMISE
      // =========================
      promiseTitle,
      promiseDesc,

      promisePoint1,
      promisePoint2,
      promisePoint3,
      promisePoint4,

      // =========================
      // COMMON
      // =========================
      status,
    } = req.body;

    // =========================
    // FILES
    // =========================
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const storyImg = files?.storyImg?.[0]?.path;

    if (!storyImg) {
      return next(new Error("Story image is required"));
    }

    const existingData = await AboutUs.findOne({
      // =========================
      // HERO / ABOUT SECTION
      // =========================
      title,
      subTitle,
      shortDesc,
      ProductsCounter,
      CustomersCounter,
      DeliveriesCounter,
      Rating,
      trustedTitle,
      trustedDesc,

      // =========================
      // OUR STORY SECTION
      // =========================
      storySubTitle,
      storyTitle,
      storyDesc,
      storySecondDesc,

      customerFirstTitle,
      customerFirstDesc,

      qualityFocusTitle,
      qualityFocusDesc,

      transparentPricingTitle,
      transparentPricingDesc,

      reliableSupportTitle,
      reliableSupportDesc,

      // =========================
      // OUR VALUES
      // =========================
      valuesTitle,
      valuesSubTitle,

      CustomerFirstTitle,
      CustomerFirstDesc,

      TrustSecurityTitle,
      TrustSecurityDesc,

      QualityTitle,
      QualityDesc,

      ContinuousImprovementTitle,
      ContinuousImprovementDesc,

      // =========================
      // WHY SHOP WITH US
      // =========================
      whyShopSubTitle,
      whyShopTitle,
      whyShopDesc,

      wideSelectionTitle,
      wideSelectionDesc,

      fastDeliveryTitle,
      fastDeliveryDesc,

      secureCheckoutTitle,
      secureCheckoutDesc,

      easyReturnsTitle,
      easyReturnsDesc,

      // =========================
      // OUR PROMISE
      // =========================
      promiseTitle,
      promiseDesc,

      promisePoint1,
      promisePoint2,
      promisePoint3,
      promisePoint4,

      // =========================
      // COMMON
      // =========================
      status,
    });

    if (existingData) {
      return next(new Error("Service already exists"));
    }

    const validateData = await aboutUsSchema.parse({
      // =========================
      // HERO / ABOUT SECTION
      // =========================
      title,
      subTitle,
      shortDesc,
      ProductsCounter,
      CustomersCounter,
      DeliveriesCounter,
      Rating,
      trustedTitle,
      trustedDesc,

      // =========================
      // OUR STORY SECTION
      // =========================
      storySubTitle,
      storyTitle,
      storyDesc,
      storySecondDesc,

      customerFirstTitle,
      customerFirstDesc,

      qualityFocusTitle,
      qualityFocusDesc,

      transparentPricingTitle,
      transparentPricingDesc,

      reliableSupportTitle,
      reliableSupportDesc,

      // =========================
      // OUR VALUES
      // =========================
      valuesTitle,
      valuesSubTitle,

      CustomerFirstTitle,
      CustomerFirstDesc,

      TrustSecurityTitle,
      TrustSecurityDesc,

      QualityTitle,
      QualityDesc,

      ContinuousImprovementTitle,
      ContinuousImprovementDesc,

      // =========================
      // WHY SHOP WITH US
      // =========================
      whyShopSubTitle,
      whyShopTitle,
      whyShopDesc,

      wideSelectionTitle,
      wideSelectionDesc,

      fastDeliveryTitle,
      fastDeliveryDesc,

      secureCheckoutTitle,
      secureCheckoutDesc,

      easyReturnsTitle,
      easyReturnsDesc,

      // =========================
      // OUR PROMISE
      // =========================
      promiseTitle,
      promiseDesc,

      promisePoint1,
      promisePoint2,
      promisePoint3,
      promisePoint4,

      // =========================
      // COMMON
      // =========================
      status,
    });

    const createAboutUs = await AboutUs.create(validateData);

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: "About Us created successfully",
      data: createAboutUs,
    });
  } catch (error) {
    next(error);
  }
};

export const getAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const getAllData = await AboutUs.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      statusCode: 200,
      message:
        getAllData.length > 0
          ? "About us retrieved successfully"
          : "No about us found",
      data: getAllData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAboutUs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const aboutUsId = req.params.id;

    // =========================
    // VALIDATE BODY
    // =========================
    const validatedData = aboutUsUpdateSchema.parse(req.body);

    // =========================
    // FILES
    // =========================
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    // =========================
    // UPDATE PAYLOAD
    // =========================
    const updatePayload: Record<string, any> = {
      ...validatedData,
    };

    if (files?.storyImg?.[0]?.path) {
      updatePayload.storyImg = files.storyImg[0].path;
    }

    // Multipart form-data sends booleans as strings
    if (req.body.isDeleted !== undefined) {
      updatePayload.isDeleted =
        req.body.isDeleted === true || req.body.isDeleted === "true";
    }

    // =========================
    // UPDATE ABOUT US
    // =========================
    const updatedAboutUs = await AboutUs.findOneAndUpdate(
      {
        _id: aboutUsId,
      },
      updatePayload,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedAboutUs) {
      return next(new appError("About us not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "About us updated successfully",
      data: updatedAboutUs,
    });
  } catch (error) {
    next(error);
  }
};
