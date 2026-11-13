import { z } from "zod";

export const generalSettingsValidation = z.object({
  logo: z.string().optional(),
  favicon: z.string().optional(),
  footerImg: z.string().optional(),

  mobileNo: z.string().optional(),
  alternateMobileNo: z.string().optional(),

  mail: z.string().email("Invalid email address").optional().or(z.literal("")),

  alternateEmail: z
    .string()
    .email("Invalid alternate email address")
    .optional()
    .or(z.literal("")),

  address: z.string().optional(),
  addressIframe: z.string().optional(),
  workingHrs: z.string().optional(),

  facebook: z.string().url("Invalid Facebook URL").optional().or(z.literal("")),

  instagram: z
    .string()
    .url("Invalid Instagram URL")
    .optional()
    .or(z.literal("")),

  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),

  twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),

  youtube: z.string().url("Invalid YouTube URL").optional().or(z.literal("")),

  whatsApp: z.string().optional(),

  topHeaderTitle: z.string().optional(),

  footerInfo: z.string().optional(),
  footerCopyrights: z.string().optional(),

  googlePlayUrl: z
    .string()
    .url("Invalid Google Play URL")
    .optional()
    .or(z.literal("")),

  appStoreUrl: z
    .string()
    .url("Invalid App Store URL")
    .optional()
    .or(z.literal("")),

  username: z.string().optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional()
    .or(z.literal("")),
});

export const updateGeneralSettingsValidation =
  generalSettingsValidation.partial();
