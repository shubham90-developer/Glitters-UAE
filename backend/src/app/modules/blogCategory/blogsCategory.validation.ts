import { z } from "zod";

export const blogsCategorySchemaSchema = z.object({
  categoryName: z.string().min(2, "Title must be at least 2 characters long"),
  status: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
