import { z } from "zod";

export const SEOPagesSchema = z.object({
  productListBgImages: z.array(z.string()).optional(),

  wishListBgImages: z.array(z.string()).optional(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateSEOPagesSchema = SEOPagesSchema.partial();
