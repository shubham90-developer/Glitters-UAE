import { z } from "zod";

export const blogsSchemaSchema = z.object({
  category: z.string().trim().optional(),

  title: z.string().trim().min(1, "Title is required"),

  shortDesc: z.string().trim().optional(),

  author: z.string().trim().optional(),

  featured: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === "boolean") return value;
      return value === "true";
    })
    .optional(),

  image: z.string().trim().optional(),

  description: z.string().trim().min(1, "Description is required"),

  QuickTips: z.string().trim().optional(),

  blackQuote: z.string().trim().optional(),

  tags: z.string().trim().optional(),

  writtenBy: z.string().trim().optional(),

  writtenByImage: z.string().trim().optional(),

  writtenByDesc: z.string().trim().optional(),

  metaTitle: z.string().trim().optional(),

  metaDesc: z.string().trim().optional(),

  metaTags: z.string().trim().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  isDeleted: z
    .union([z.boolean(), z.string()])
    .transform((value) => {
      if (typeof value === "boolean") return value;
      return value === "true";
    })
    .optional(),
});

// =========================
// UPDATE BLOG
// =========================
export const blogsSchemaUpdateSchema = blogsSchemaSchema.partial();
