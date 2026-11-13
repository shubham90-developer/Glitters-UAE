import { z } from "zod";

export const testimonialSchema = z.object({
  image: z.string().optional(),
  name: z.string().optional(),
  designation: z.string().optional(),
  description: z.string().optional(),
  rating: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updatetestimonialSchema = z.object({
  image: z.string().optional(),
  name: z.string().optional(),
  designation: z.string().optional(),
  description: z.string().optional(),
  rating: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
