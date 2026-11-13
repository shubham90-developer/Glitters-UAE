import { z } from "zod";

export const wishlistSchema = z.object({
  product: z.string().trim().min(1, "Product is required"),
});
