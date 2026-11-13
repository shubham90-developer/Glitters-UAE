import z from "zod";

export const createOrderSchema = z.object({
  shippingAddress: z.object({
    name: z.string().trim().min(1, "Name is required"),
    type: z.string().trim().optional(),
    phone: z.string().trim().min(1, "Phone is required"),
    address: z.string().trim().min(1, "Address is required"),
    city: z.string().trim().optional(),
    state: z.string().trim().optional(),
    pincode: z.string().trim().optional(),
  }),

  paymentMethod: z.enum([
    "card",
    "upi",
    "razorpay",
    "tabby",
    "cod",
    "apple-pay",
  ]),
});
