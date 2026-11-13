import z from "zod";

export const appBannerSchema = z.object({
  AppBanner: z.string().min(1, "Category image is required"),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

export const updateAppBannerSchema = z.object({
  AppBanner: z.string().optional(),

  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});
