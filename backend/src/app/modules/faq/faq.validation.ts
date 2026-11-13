import z from "zod";

export const faqSchema = z.object({
  category: z.enum(["orders", "shipping", "payments", "returns", "products"]),

  question: z.string().min(1, "Question is required").trim(),

  answer: z.string().min(1, "Answer is required").trim(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateFaqSchema = z.object({
  category: z
    .enum(["orders", "shipping", "payments", "returns", "products"])
    .optional(),

  question: z.string().min(1, "Question is required").trim().optional(),

  answer: z.string().min(1, "Answer is required").trim().optional(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});
