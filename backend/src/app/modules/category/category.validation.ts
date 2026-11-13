import z from "zod";

export const categorySchema = z.object({
  img: z.string().min(1, "Category image is required"),

  categoryName: z.string().min(1, "Category name is required").trim(),

  categoryDesc: z.string().trim().optional(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateCategorySchema = z.object({
  img: z.string().optional(),

  categoryName: z
    .string()
    .min(1, "Category name is required")
    .trim()
    .optional(),

  categoryDesc: z.string().trim().optional(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});
