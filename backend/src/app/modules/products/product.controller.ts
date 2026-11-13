import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { appError } from "../../errors/appError";
import { ProductReview } from "../product-reviews/Productreview.model ";
import { Product } from "./product.model";
import { productSchema, updateProductSchema } from "./product.validation";

type VariantInput = Record<string, any>;

const parseJsonField = <T>(field: unknown, defaultValue: T): T => {
  if (field === undefined || field === null || field === "") {
    return defaultValue;
  }

  if (typeof field === "string") {
    try {
      return JSON.parse(field) as T;
    } catch {
      throw new appError("Invalid JSON format", 400);
    }
  }

  return field as T;
};

const parseNumber = (value: unknown, defaultValue = 0): number => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new appError("Invalid numeric value in product variant", 400);
  }

  return parsed;
};

const parseBoolean = (value: unknown): boolean =>
  value === true || value === "true" || value === "1";

/**
 * Deal of the Day window.
 * - Deal turned off -> both times are cleared
 * - Deal turned on  -> both times are required and the end must be after the start
 */
const resolveDealTimes = (
  dealOfTheDay: boolean,
  startValue: unknown,
  endValue: unknown,
): { dealStartTime: Date | null; dealEndTime: Date | null } => {
  if (!dealOfTheDay) return { dealStartTime: null, dealEndTime: null };

  const toDate = (value: unknown, label: string): Date => {
    if (value instanceof Date) {
      if (Number.isNaN(value.getTime())) {
        throw new appError(`${label} is not a valid date`, 400);
      }
      return value;
    }

    const text =
      value === undefined || value === null ? "" : String(value).trim();

    if (!text || text === "null" || text === "undefined") {
      throw new appError(`${label} is required for Deal of the Day`, 400);
    }

    const date = new Date(text);

    if (Number.isNaN(date.getTime())) {
      throw new appError(`${label} is not a valid date`, 400);
    }

    return date;
  };

  const dealStartTime = toDate(startValue, "Deal start time");
  const dealEndTime = toDate(endValue, "Deal end time");

  if (dealEndTime.getTime() <= dealStartTime.getTime()) {
    throw new appError("Deal end time must be after the start time", 400);
  }

  return { dealStartTime, dealEndTime };
};

/**
 * Only one product can be the Deal of the Day.
 * Turns the deal off (and clears its times) on every other product.
 */
const clearOtherDeals = (exceptId: unknown) =>
  Product.updateMany(
    { _id: { $ne: new Types.ObjectId(String(exceptId)) }, dealOfTheDay: true },
    { $set: { dealOfTheDay: false, dealStartTime: null, dealEndTime: null } },
  );

// Returns a clean id string, or undefined for "", null, "null", "undefined"
const cleanObjectId = (value: unknown): string | undefined => {
  if (value === undefined || value === null) return undefined;

  const id = String(value).trim();

  if (!id || id === "null" || id === "undefined") return undefined;

  return id;
};

const cleanImageList = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter(
        (item): item is string =>
          typeof item === "string" && item.trim() !== "",
      )
    : [];

const createVariantImagesResolver = (req: Request) => {
  const files = (req.files || {}) as {
    [fieldname: string]: Express.Multer.File[];
  };

  const uploadedImages = files.variantImages?.map((file) => file.path) ?? [];

  const hasIndexes = req.body.variantImageIndexes !== undefined;
  const imageIndexes = parseJsonField<number[]>(
    req.body.variantImageIndexes,
    [],
  );

  return (variantIndex: number): string[] => {
    // Old clients without indexes: one file per variant, by position
    if (!hasIndexes) {
      return uploadedImages[variantIndex] ? [uploadedImages[variantIndex]] : [];
    }

    return uploadedImages.filter(
      (_, fileIndex) => Number(imageIndexes[fileIndex]) === variantIndex,
    );
  };
};

// Builds clean variants. `existingVariants` is only passed on update.
const prepareVariants = (
  variants: VariantInput[],
  getUploadedImages: (index: number) => string[],
  existingVariants: VariantInput[] = [],
) =>
  variants.map((variant, index) => {
    const existing = variant._id
      ? existingVariants.find(
          (item) => item._id?.toString() === variant._id.toString(),
        )
      : undefined;

    // Images already saved on this variant (supports legacy single `image`)
    const existingImages: string[] = existing
      ? cleanImageList(Array.from(existing.images ?? [])).length
        ? cleanImageList(Array.from(existing.images ?? []))
        : existing.image
          ? [existing.image]
          : []
      : [];

    // Images the client wants to KEEP.
    // - `images` sent (even empty) => use it, so removed images are dropped
    // - only legacy `image` sent    => use that
    // - nothing sent                => keep what is already stored
    let keptImages: string[];

    if (Array.isArray(variant.images)) {
      keptImages = cleanImageList(variant.images);
    } else if ("image" in variant) {
      keptImages =
        typeof variant.image === "string" && variant.image
          ? [variant.image]
          : [];
    } else {
      keptImages = existingImages;
    }

    const images = [...keptImages, ...getUploadedImages(index)];

    const prepared: Record<string, unknown> = {
      price: parseNumber(variant.price, Number(existing?.price ?? 0)),
      delPrice: parseNumber(variant.delPrice, Number(existing?.delPrice ?? 0)),
      discount: parseNumber(variant.discount, Number(existing?.discount ?? 0)),
      stock: parseNumber(variant.stock, Number(existing?.stock ?? 0)),
      images,
      image: images[0] || "", // legacy mirror
    };

    if (variant._id) prepared._id = variant._id;

    // Size and color: if the key is sent, use it (empty clears); else keep existing.
    const size = cleanObjectId(
      "size" in variant ? variant.size : existing?.size,
    );
    if (size) prepared.size = size;

    const color = cleanObjectId(
      "color" in variant ? variant.color : existing?.color,
    );
    if (color) prepared.color = color;

    return prepared;
  });

const populateOptions = [
  { path: "category", select: "_id categoryName status" },
  {
    path: "subCategory",
    select: "_id subCategoryName category status",
  },
  { path: "material", select: "_id name status" },
  { path: "brand", select: "_id name status" },
  {
    path: "coupon",
    select: "_id couponCode couponAmount couponName subTitle discount status",
  },
  { path: "variants.size", select: "_id size status" },
  { path: "variants.color", select: "_id colorName hexCode status" },
];

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const variants = parseJsonField<VariantInput[]>(req.body.variants, []);
    const specifications = parseJsonField<any[]>(req.body.specifications, []);
    const tags = parseJsonField<string[]>(req.body.tags, []);

    const dealOfTheDay = parseBoolean(req.body.dealOfTheDay);

    const dealTimes = resolveDealTimes(
      dealOfTheDay,
      req.body.dealStartTime,
      req.body.dealEndTime,
    );

    const productData = {
      productName: req.body.productName,
      category: req.body.category,
      subCategory: req.body.subCategory || undefined,
      material: req.body.material || undefined,
      section: req.body.section || undefined,
      brand: req.body.brand || undefined,
      dealOfTheDay,
      ...dealTimes,
      coupon: req.body.coupon || undefined,
      tags,
      videoUrl: req.body.videoUrl || "",
      variants: prepareVariants(variants, createVariantImagesResolver(req)),
      shortDesc: req.body.shortDesc,
      desc: req.body.desc,
      additionalInformation: req.body.additionalInformation || "",
      shippingReturnPolicy: req.body.shippingReturnPolicy,
      specifications,
      status: req.body.status || "active",
      isDeleted: false,
    };

    const validatedData = productSchema.parse(productData);
    const createdProduct = await Product.create(validatedData);

    // new deal product replaces any previous deal
    if (dealOfTheDay) await clearOtherDeals(createdProduct._id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Product created successfully",
      data: createdProduct,
    });
  } catch (error) {
    next(error);
  }
};

const attachReviews = async (products: any[]) => {
  if (!products.length) return [];

  const rows = await ProductReview.aggregate<{
    _id: any;
    ratings: number[];
  }>([
    { $match: { product: { $in: products.map((p) => p._id) } } },
    { $group: { _id: "$product", ratings: { $push: "$rating" } } },
  ]);

  const ratingsByProduct = new Map<string, number[]>(
    rows.map((row) => [String(row._id), row.ratings]),
  );

  return products.map((product) => {
    const plain = product.toObject ? product.toObject() : product;
    const ratings = ratingsByProduct.get(String(plain._id)) ?? [];

    return { ...plain, reviews: ratings.map((rating) => ({ rating })) };
  });
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .populate(populateOptions)
      .sort({ createdAt: -1 });

    const data = await attachReviews(products);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Products fetched successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllProductsById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = await Product.findOne({ _id: req.params.id }).populate(
      populateOptions,
    );

    if (!product) {
      return next(new appError("Product not found", 404));
    }

    const [data] = await attachReviews([product]);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      data,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.id;

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return next(new appError("Product not found", 404));
    }

    const existingVariants =
      (existingProduct.variants as unknown as VariantInput[]) || [];

    const variants = parseJsonField<VariantInput[]>(
      req.body.variants,
      existingVariants,
    );

    const specifications = parseJsonField<any[]>(
      req.body.specifications,
      existingProduct.specifications || [],
    );

    const tags = parseJsonField<string[]>(
      req.body.tags,
      existingProduct.tags || [],
    );

    // New value when sent, otherwise keep existing. Empty values clear optional fields.
    const optionalField = (value: unknown, current: unknown) =>
      value !== undefined ? value || undefined : current;

    const dealOfTheDay =
      req.body.dealOfTheDay !== undefined
        ? parseBoolean(req.body.dealOfTheDay)
        : existingProduct.dealOfTheDay;

    // Only validate / change the deal window when the request touches it,
    // so unrelated updates (e.g. status) never fail on older deal products.
    const dealTouched =
      req.body.dealOfTheDay !== undefined ||
      req.body.dealStartTime !== undefined ||
      req.body.dealEndTime !== undefined;

    const dealTimes = dealTouched
      ? resolveDealTimes(
          dealOfTheDay,
          req.body.dealStartTime ?? existingProduct.dealStartTime,
          req.body.dealEndTime ?? existingProduct.dealEndTime,
        )
      : {
          dealStartTime: existingProduct.dealStartTime ?? null,
          dealEndTime: existingProduct.dealEndTime ?? null,
        };

    const updateData = {
      productName: req.body.productName ?? existingProduct.productName,
      category: req.body.category ?? existingProduct.category,
      subCategory: optionalField(
        req.body.subCategory,
        existingProduct.subCategory,
      ),
      material: optionalField(req.body.material, existingProduct.material),
      section: optionalField(req.body.section, existingProduct.section),
      brand: optionalField(req.body.brand, existingProduct.brand),
      dealOfTheDay,
      ...dealTimes,
      coupon: optionalField(req.body.coupon, existingProduct.coupon),
      tags,
      videoUrl:
        req.body.videoUrl !== undefined
          ? req.body.videoUrl
          : existingProduct.videoUrl,
      variants: prepareVariants(
        variants,
        createVariantImagesResolver(req),
        existingVariants,
      ),
      shortDesc: req.body.shortDesc ?? existingProduct.shortDesc,
      desc: req.body.desc ?? existingProduct.desc,
      additionalInformation:
        req.body.additionalInformation !== undefined
          ? req.body.additionalInformation
          : existingProduct.additionalInformation,
      shippingReturnPolicy:
        req.body.shippingReturnPolicy ?? existingProduct.shippingReturnPolicy,
      specifications,
      reviews: existingProduct.reviews || [],
      status: req.body.status ?? existingProduct.status,
      isDeleted:
        req.body.isDeleted !== undefined
          ? req.body.isDeleted === true || req.body.isDeleted === "true"
          : existingProduct.isDeleted,
    };

    const validatedData = updateProductSchema.parse(updateData);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      validatedData,
      { new: true, runValidators: true },
    );

    // saving a product with Deal of the Day = Yes makes it the only deal
    if (updatedProduct && dealOfTheDay && req.body.dealOfTheDay !== undefined) {
      await clearOtherDeals(updatedProduct._id);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deletedProduct = await Product.findOneAndDelete({
      _id: req.params.id,
    });

    if (!deletedProduct) {
      return next(new appError("Product not found", 404));
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};
