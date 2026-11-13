import z from "zod";

export const termsSchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required").trim(),

  title: z.string().min(1, "Title is required").trim(),

  shortDesc: z.string().min(1, "Short description is required").trim(),

  content: z.string().min(1, "Content is required"),

  isDeleted: z.boolean().optional(),
});

export const updateTermsSchema = z.object({
  badgeTitle: z.string().min(1, "Badge title is required").trim(),

  title: z.string().min(1, "Title is required").trim(),

  shortDesc: z.string().min(1, "Short description is required").trim(),

  content: z.string().min(1, "Content is required"),

  isDeleted: z.boolean().optional(),
});
