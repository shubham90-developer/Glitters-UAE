import z from "zod";

export const sizeSchema = z.object({
  size: z.string().min(1, "size must be at least 1 characters long"),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});

export const updateSizeSchema = z.object({
  size: z.string().min(1, "size must be at least 1 characters long").optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z.boolean().optional(),
});
