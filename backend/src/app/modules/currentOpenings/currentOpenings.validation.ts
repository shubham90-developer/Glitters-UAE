import z from "zod";

export const currentOpeningsSchema = z.object({
  jobID: z.string().min(1, "Job ID is required"),

  jobTitle: z.string().min(2, "Title must be at least 2 characters long"),

  shortDesc: z.string().optional(),

  experience: z.string().optional(),

  location: z.string().optional(),

  jobType: z.string().optional(),

  dept: z.string().optional(),

  roles: z.string().optional(),

  salary: z.string().optional(),

  openings: z.string().optional(),

  responsibilities: z.string().optional(),

  requirements: z.string().optional(),

  benefits: z.string().optional(),

  isDeleted: z.boolean().optional(),
});

export const updatecurrentOpeningsSchema = z.object({
  jobID: z.string().min(1, "Job ID is required").optional(),

  jobTitle: z
    .string()
    .min(2, "Title must be at least 2 characters long")
    .optional(),

  shortDesc: z.string().optional(),

  experience: z.string().optional(),

  location: z.string().optional(),

  jobType: z.string().optional(),

  dept: z.string().optional(),

  roles: z.string().optional(),

  salary: z.string().optional(),

  openings: z.string().optional(),

  responsibilities: z.string().optional(),

  requirements: z.string().optional(),

  benefits: z.string().optional(),

  isDeleted: z.boolean().optional(),
});
