import z from "zod";

export const awardsSchema = z.object({
  image: z.string().optional(),
  year: z.string().optional(),
  title: z.string().optional(),
  shortDesc: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const awardsUpdateSchema = z.object({
  image: z.string().optional(),
  year: z.string().optional(),
  title: z.string().optional(),
  shortDesc: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
