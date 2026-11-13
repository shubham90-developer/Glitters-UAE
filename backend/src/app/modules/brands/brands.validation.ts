import z from "zod";

export const brandsSchema = z.object({
  name: z.string().min(2, "Title must be at least 2 characters long"),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});

export const updateBrandsSchema = z.object({
  name: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});
