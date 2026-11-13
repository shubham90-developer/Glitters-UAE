import z from "zod";

export const colorsSchema = z.object({
  colorName: z.string().min(1, "Color name is required").trim(),

  hexCode: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/, "Invalid hex code")
    .trim(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateColorsSchema = colorsSchema.partial();
