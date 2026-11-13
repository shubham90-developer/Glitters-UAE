import z from "zod";

export const storeEnquirySchema = z.object({
  storeName: z.optional(z.string().min(1, "Store is required")),

  fullName: z.string().optional(),

  phone: z.string().optional(),

  email: z.string().optional(),
  msg: z.string().optional(),

  isDeleted: z.boolean().optional(),
});

export const updateStoreEnquirySchema = z.object({
  storeName: z.string().optional(),

  fullName: z.string().optional(),

  phone: z.string().optional(),

  email: z.string().optional(),

  msg: z.string().optional(),

  isDeleted: z.boolean().optional(),
});
