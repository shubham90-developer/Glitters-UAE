import { z } from "zod";

export const addSavedCardSchema = z.object({
  type: z.enum(["Visa", "Mastercard", "RuPay", "American Express"]),
  last4: z.string().regex(/^\d{4}$/, "last4 must be 4 digits"),
  expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY"),
  holder: z.string().trim().min(2, "Card holder name is required"),
  isDefault: z.boolean().optional().default(false),
  gatewayToken: z.string().trim().optional(),
});
