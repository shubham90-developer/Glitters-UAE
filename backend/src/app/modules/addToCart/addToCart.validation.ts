import z from "zod";

export const addToCartSchema = z.object({
  product: z.string().trim().min(1, "Product is required"),
  variantId: z.string().trim().optional(),
  quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
});

export const updateCartSchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});
