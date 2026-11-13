import { z } from "zod";

// ============================================
// MONGODB OBJECT ID SCHEMA
// ============================================

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// ============================================
// PRODUCT VARIANT SCHEMA
// ============================================

const productVariantSchema = z.object({
  _id: objectIdSchema.optional(),

  size: objectIdSchema.optional(),

  color: objectIdSchema.optional(),

  price: z.number().min(0, "Price cannot be negative").optional().default(0),

  delPrice: z
    .number()
    .min(0, "Del price cannot be negative")
    .optional()
    .default(0),

  discount: z
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot be greater than 100")
    .optional()
    .default(0),

  stock: z
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .optional()
    .default(0),

  // Multiple images per variant
  images: z.array(z.string()).optional().default([]),

  // Legacy single image (mirrors images[0])
  image: z.string().optional().default(""),
});

// ============================================
// PRODUCT SPECIFICATION SCHEMA
// ============================================

const productSpecificationSchema = z.object({
  specificationName: z.string().trim().min(1, "Specification name is required"),

  value: z.string().trim().min(1, "Specification value is required"),
});

// ============================================
// PRODUCT REVIEW SCHEMA
// ============================================

const productReviewSchema = z.object({
  user: objectIdSchema.optional(),

  name: z.string().trim().min(1, "Name is required"),

  email: z.string().trim().email("Invalid email address"),

  rating: z
    .number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),

  reviewTitle: z.string().trim().min(1, "Review title is required"),

  review: z.string().trim().min(1, "Review is required"),

  isVerified: z.boolean().optional().default(false),

  status: z
    .enum(["pending", "approved", "rejected"])
    .optional()
    .default("pending"),

  helpfulCount: z.number().int().min(0).optional().default(0),
});

// ============================================
// CREATE PRODUCT SCHEMA
// ============================================

export const productSchema = z.object({
  productName: z.string().trim().min(1, "Product name is required"),

  category: objectIdSchema,

  subCategory: objectIdSchema.optional(),

  material: objectIdSchema.optional(),

  section: z
    .enum(["New Offers", "Popular Products", "New Arrivals"])
    .optional(),

  brand: objectIdSchema.optional(),

  dealOfTheDay: z.boolean().optional().default(false),

  dealStartTime: z.date().nullable().optional(),

  dealEndTime: z.date().nullable().optional(),

  coupon: objectIdSchema.optional(),

  tags: z.array(z.string().trim().min(1)).optional().default([]),

  videoUrl: z
    .string()
    .trim()
    .url("Invalid video URL")
    .optional()
    .or(z.literal("")),

  variants: z
    .array(productVariantSchema)
    .min(1, "At least one product variant is required"),

  shortDesc: z.string().trim().min(1, "Short description is required"),

  desc: z.string().trim().min(1, "Product description is required"),

  additionalInformation: z.string().trim().optional().default(""),

  shippingReturnPolicy: z
    .string()
    .trim()
    .min(1, "Shipping & return policy is required"),

  specifications: z.array(productSpecificationSchema).optional().default([]),

  reviews: z.array(productReviewSchema).optional().default([]),

  status: z.enum(["active", "inactive"]).optional().default("active"),

  isDeleted: z.boolean().optional().default(false),
});

// ============================================
// UPDATE PRODUCT SCHEMA
// ============================================

export const updateProductSchema = productSchema.partial();
