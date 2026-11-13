import z from "zod";

export const offerBannerSchema = z.object({
  offerBannerImg: z.string().trim().min(1, "Offer banner image is required"),

  category: z.string().trim().optional(),

  subCategory: z.string().trim().optional(),

  redirectUrl: z.string().trim().optional().default(""),

  status: z.enum(["active", "inactive"]).optional().default("active"),

  isDeleted: z.boolean().optional().default(false),
});

export const updateOfferBannerSchema = offerBannerSchema.partial();
