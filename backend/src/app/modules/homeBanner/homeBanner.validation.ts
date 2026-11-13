import { z } from "zod";

export const homeBanneSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  shortDesc: z.string().optional(),
  bgVideo: z.string().optional(),
  status: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});

export const homeBannerUpdateSchema = z.object({
  title: z.string().optional(),
  subTitle: z.string().optional(),
  shortDesc: z.string().optional(),
  bgVideo: z.string().optional(),
  status: z.boolean().optional(),
  isDeleted: z.boolean().optional(),
});
