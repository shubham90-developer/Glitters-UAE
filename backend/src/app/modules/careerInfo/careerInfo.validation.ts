import z from "zod";

const employeeBenefitSchema = z.object({
  title: z.string().min(1, "Benefit title is required"),

  icon: z.string().optional(),
});

const hiringProcessItemSchema = z.object({
  step: z.string().min(1, "Step is required"),

  title: z.string().min(1, "Title is required"),

  description: z.string().min(1, "Description is required"),
});

export const careerInfoSchema = z.object({
  // Hero Section
  badgeText: z.string().optional(),

  heroTitle: z.string().optional(),

  heroHighlight: z.string().optional(),

  heroDescription: z.string().optional(),

  // Employee Benefits
  benefitsLabel: z.string().optional(),

  benefitsTitle: z.string().optional(),

  employeeBenefits: z.array(employeeBenefitSchema).optional(),

  // Culture Section
  cultureTitle: z.string().optional(),

  cultureDescription: z.string().optional(),

  culturePoints: z.array(z.string()).optional(),

  // Hiring Process
  hiringProcessLabel: z.string().optional(),

  hiringProcessTitle: z.string().optional(),

  hiringProcess: z.array(hiringProcessItemSchema).optional(),

  isDeleted: z.boolean().optional(),
});

// =========================
// UPDATE CAREER INFO
// =========================
export const updatecareerInfoSchema = z.object({
  // Hero Section
  badgeText: z.string().optional(),

  heroTitle: z.string().optional(),

  heroHighlight: z.string().optional(),

  heroDescription: z.string().optional(),

  // Employee Benefits
  benefitsLabel: z.string().optional(),

  benefitsTitle: z.string().optional(),

  employeeBenefits: z.array(employeeBenefitSchema).optional(),

  // Culture Section
  cultureTitle: z.string().optional(),

  cultureDescription: z.string().optional(),

  culturePoints: z.array(z.string()).optional(),

  // Hiring Process
  hiringProcessLabel: z.string().optional(),

  hiringProcessTitle: z.string().optional(),

  hiringProcess: z.array(hiringProcessItemSchema).optional(),

  isDeleted: z.boolean().optional(),
});
