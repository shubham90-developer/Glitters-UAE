import z from "zod";

export const privacyPolicySchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required").trim(),

  title: z.string().min(1, "Title is required").trim(),

  shortDesc: z.string().min(1, "Short description is required").trim(),

  content: z.string().min(1, "Content is required"),

  isDeleted: z.boolean().optional(),
});

export const updatePrivacyPolicySchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required").trim().optional(),

  title: z.string().min(1, "Title is required").trim().optional(),

  shortDesc: z
    .string()
    .min(1, "Short description is required")
    .trim()
    .optional(),

  content: z.string().min(1, "Content is required").optional(),

  isDeleted: z.boolean().optional(),
});
