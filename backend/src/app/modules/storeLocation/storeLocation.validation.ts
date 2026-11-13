import z from "zod";

export const storeLocationSchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required"),

  img: z.string().min(1, "Store image is required"),

  storeName: z.string().min(2, "Store name must be at least 2 characters long"),

  rating: z.string().optional(),

  shortDesc: z.string().optional(),

  address: z.string().min(1, "Address is required"),

  phone: z.string().optional(),

  email: z.string().email("Invalid email address").optional(),

  workingHours: z.string().optional(),

  qrcode: z.string().optional(),

  facebook: z.string().optional(),

  instagram: z.string().optional(),

  twitter: z.string().optional(),

  youtube: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});

export const updateStoreLocationSchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required").optional(),

  img: z.string().optional(),

  storeName: z
    .string()
    .min(2, "Store name must be at least 2 characters long")
    .optional(),

  rating: z.string().optional(),

  shortDesc: z.string().optional(),

  address: z.string().optional(),

  phone: z.string().optional(),

  email: z.string().email("Invalid email address").optional(),

  workingHours: z.string().optional(),

  qrcode: z.string().optional(),

  facebook: z.string().optional(),

  instagram: z.string().optional(),

  twitter: z.string().optional(),

  youtube: z.string().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});
