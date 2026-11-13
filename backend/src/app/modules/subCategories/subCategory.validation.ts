import z from "zod";

export const subCategorySchema = z.object({
  category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category id"),

  img: z.string().min(1, "Sub category image is required"),

  subCategoryName: z.string().min(1, "Sub category name is required").trim(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateSubCategorySchema = subCategorySchema.partial();
