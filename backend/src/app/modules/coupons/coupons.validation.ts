import z from "zod";

export const couponsSchema = z.object({
  couponName: z.string().min(1, "Coupon  is required").trim(),
  subTitle: z.string().trim().optional(),
  couponCode: z.string().trim().optional(),
  couponAmount: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateCouponsSchema = couponsSchema.partial();
