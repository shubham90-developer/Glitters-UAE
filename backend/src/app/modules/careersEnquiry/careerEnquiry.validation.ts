import z from "zod";

export const careerEnquirySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.string().optional(),
  phone: z.string().optional(),
  currentPosition: z.string().optional(),
  experience: z.string().optional(),
  currentLocation: z.string().optional(),
  expectedSalary: z.string().optional(),
  linkedIn: z.string().optional(),
  resume: z.string().optional(),
  coverLetter: z.string().optional(),
  message: z.string().optional(),
  isDeleted: z.boolean().optional(),
});

export const updatecareerEnquirySchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  emailAddress: z.string().optional(),
  phone: z.string().optional(),
  currentPosition: z.string().optional(),
  experience: z.string().optional(),
  currentLocation: z.string().optional(),
  expectedSalary: z.string().optional(),
  linkedIn: z.string().optional(),
  resume: z.string().optional(),
  coverLetter: z.string().optional(),
  message: z.string().optional(),
  isDeleted: z.boolean().optional(),
});
