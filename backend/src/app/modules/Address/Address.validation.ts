import { z } from "zod";

export const addressSchema = z.object({
  type: z.enum(["Home", "Office"]),

  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  // accepts "+91 98765 43210", "9876543210", etc. -> saved as "+919876543210"
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, "").slice(-10))
    .refine((value) => /^[6-9]\d{9}$/.test(value), "Invalid phone number")
    .transform((value) => `+91${value}`),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(300, "Address is too long"),

  city: z.string().trim().min(1, "City is required").max(100),

  state: z.string().trim().min(1, "State is required").max(100),

  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pincode must be 6 digits"),

  isDefault: z.boolean().optional().default(false),
});
