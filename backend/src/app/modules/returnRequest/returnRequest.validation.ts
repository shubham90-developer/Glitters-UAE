import z from "zod";

export const returnRequestSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required").trim(),

  emailAddress: z.string().email("Invalid email address").trim().toLowerCase(),

  product: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product id"),

  reason: z.string().min(1, "Return reason is required").trim(),

  additionalDetails: z.string().trim().optional(),

  isConfirmed: z.boolean().refine((value) => value === true, {
    message: "Please confirm that the information provided is correct",
  }),

  status: z
    .enum(["pending", "approved", "rejected", "received", "refunded"])
    .optional(),

  isDeleted: z.boolean().optional(),
});

export const updateReturnRequestSchema = z.object({
  orderNumber: z.string().min(1, "Order number is required").trim().optional(),

  emailAddress: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .optional(),

  product: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid product id")
    .optional(),

  reason: z.string().min(1, "Return reason is required").trim().optional(),

  additionalDetails: z.string().trim().optional(),

  isConfirmed: z.boolean().optional(),

  status: z
    .enum(["pending", "approved", "rejected", "received", "refunded"])
    .optional(),

  isDeleted: z.boolean().optional(),
});
