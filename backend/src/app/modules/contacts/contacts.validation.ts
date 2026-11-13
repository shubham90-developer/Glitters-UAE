import z from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim(),

  lastName: z.string().min(1, "Last name is required").trim(),

  emailAddress: z.string().email("Invalid email address").trim().toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .trim(),

  subject: z.enum(["orders", "shipping", "payments", "returns", "products"]),

  orderNo: z.string().trim().optional(),

  message: z.string().min(1, "Message is required").trim(),

  status: z.enum(["new", "in-progress", "resolved"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateContactSchema = z.object({
  firstName: z.string().min(1, "First name is required").trim().optional(),

  lastName: z.string().min(1, "Last name is required").trim().optional(),

  emailAddress: z
    .string()
    .email("Invalid email address")
    .trim()
    .toLowerCase()
    .optional(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .trim()
    .optional(),

  subject: z
    .enum(["orders", "shipping", "payments", "returns", "products"])
    .optional(),

  orderNo: z.string().trim().optional(),

  message: z.string().min(1, "Message is required").trim().optional(),

  status: z.enum(["new", "in-progress", "resolved"]).optional(),

  isDeleted: z.boolean().optional(),
});
