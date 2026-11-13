import z from "zod";

export const counterSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters long"),
  subTitle: z.string().min(2, "Title must be at least 2 characters long"),
  happyCustomers: z.string().optional(),
  products: z.string().optional(),
  ordersDelivered: z.string().optional(),
  customerRating: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updateCounterSchema = z.object({
  title: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  subTitle: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),
  happyCustomers: z.string().optional(),
  products: z.string().optional(),
  ordersDelivered: z.string().optional(),
  customerRating: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
