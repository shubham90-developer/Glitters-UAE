import z from "zod";

const optionalLink = z
  .string()
  .trim()
  .url("Link must be a valid URL")
  .optional()
  .or(z.literal(""));

export const topSaleBannerSchema = z.object({
  offerBannerImg1: z.string().trim().min(1, "Offer banner image is required"),
  offerBannerImg2: z.string().trim().min(1, "Offer banner image is required"),
  offerBannerImg3: z.string().trim().min(1, "Offer banner image is required"),

  offerBannerLink1: optionalLink,
  offerBannerLink2: optionalLink,
  offerBannerLink3: optionalLink,

  status: z.enum(["active", "inactive"]).optional().default("active"),

  isDeleted: z.boolean().optional().default(false),
});

export const updateTopSaleBannerSchema = topSaleBannerSchema.partial();
