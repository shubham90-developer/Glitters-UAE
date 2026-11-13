import z from "zod";

export const materialSchema = z.object({
  name: z.string().min(1, "material must be at least 1 characters long"),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});

export const updateMaterialSchema = z.object({
  name: z
    .string()
    .min(1, "material must be at least 1 characters long")
    .optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});
