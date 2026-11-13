import { z } from "zod";

// the form is sent as multipart/form-data, so every value arrives as a string
export const createReviewSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),

  email: z.string().trim().email("Enter a valid email address"),

  rating: z.coerce
    .number()
    .int("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot be greater than 5"),

  reviewTitle: z
    .string()
    .trim()
    .min(1, "Review title is required")
    .max(120, "Review title is too long"),

  review: z
    .string()
    .trim()
    .min(1, "Review is required")
    .max(2000, "Review is too long"),
});
