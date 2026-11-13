import z from "zod";

// =========================
// CREATE ABOUT US
// =========================
export const aboutUsSchema = z.object({
  // HERO / ABOUT SECTION
  title: z.string().trim().min(1, "Title is required"),

  subTitle: z.string().trim().min(1, "Sub title is required"),

  shortDesc: z.string().trim().min(1, "Short description is required"),

  ProductsCounter: z.string().trim().optional(),

  CustomersCounter: z.string().trim().optional(),

  DeliveriesCounter: z.string().trim().optional(),

  Rating: z.string().trim().optional(),

  trustedTitle: z.string().trim().optional(),

  trustedDesc: z.string().trim().optional(),

  // =========================
  // OUR STORY SECTION
  // =========================
  storySubTitle: z.string().trim().optional(),

  storyTitle: z.string().trim().optional(),

  storyDesc: z.string().trim().optional(),

  storySecondDesc: z.string().trim().optional(),

  storyImg: z.string().trim().optional(),

  customerFirstTitle: z.string().trim().optional(),

  customerFirstDesc: z.string().trim().optional(),

  qualityFocusTitle: z.string().trim().optional(),

  qualityFocusDesc: z.string().trim().optional(),

  transparentPricingTitle: z.string().trim().optional(),

  transparentPricingDesc: z.string().trim().optional(),

  reliableSupportTitle: z.string().trim().optional(),

  reliableSupportDesc: z.string().trim().optional(),

  // =========================
  // OUR VALUES
  // =========================
  valuesTitle: z.string().trim().optional(),

  valuesSubTitle: z.string().trim().optional(),

  CustomerFirstTitle: z.string().trim().optional(),

  CustomerFirstDesc: z.string().trim().optional(),

  TrustSecurityTitle: z.string().trim().optional(),

  TrustSecurityDesc: z.string().trim().optional(),

  QualityTitle: z.string().trim().optional(),

  QualityDesc: z.string().trim().optional(),

  ContinuousImprovementTitle: z.string().trim().optional(),

  ContinuousImprovementDesc: z.string().trim().optional(),

  // =========================
  // WHY SHOP WITH US
  // =========================
  whyShopSubTitle: z.string().trim().optional(),

  whyShopTitle: z.string().trim().optional(),

  whyShopDesc: z.string().trim().optional(),

  wideSelectionTitle: z.string().trim().optional(),

  wideSelectionDesc: z.string().trim().optional(),

  fastDeliveryTitle: z.string().trim().optional(),

  fastDeliveryDesc: z.string().trim().optional(),

  secureCheckoutTitle: z.string().trim().optional(),

  secureCheckoutDesc: z.string().trim().optional(),

  easyReturnsTitle: z.string().trim().optional(),

  easyReturnsDesc: z.string().trim().optional(),

  // =========================
  // OUR PROMISE
  // =========================
  promiseTitle: z.string().trim().optional(),

  promiseDesc: z.string().trim().optional(),

  promisePoint1: z.string().trim().optional(),

  promisePoint2: z.string().trim().optional(),

  promisePoint3: z.string().trim().optional(),

  promisePoint4: z.string().trim().optional(),

  // =========================
  // COMMON
  // =========================
  status: z.enum(["active", "inactive"]).optional(),

  isDeleted: z.boolean().optional(),
});

// =========================
// UPDATE ABOUT US
// =========================
export const aboutUsUpdateSchema = aboutUsSchema.partial();
