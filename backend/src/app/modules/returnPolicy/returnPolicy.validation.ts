import z from "zod";

// =========================
// REUSABLE SUB SCHEMAS
// =========================

const featureSchema = z.object({
  icon: z.string().trim().optional(),

  title: z.string().min(1, "Feature title is required").trim(),

  desc: z.string().trim().optional(),
});

const returnStepSchema = z.object({
  stepNo: z.string().trim().optional(),

  icon: z.string().trim().optional(),

  title: z.string().min(1, "Step title is required").trim(),

  desc: z.string().trim().optional(),
});

const refundTimelineSchema = z.object({
  stepNo: z.string().trim().optional(),

  title: z.string().min(1, "Timeline title is required").trim(),

  desc: z.string().trim().optional(),
});

// =========================
// CREATE
// =========================

export const returnPolicySchema = z.object({
  // Hero
  badgeTitle: z.string().min(1, "Badge title is required").trim(),

  title: z.string().min(1, "Title is required").trim(),

  shortDesc: z.string().min(1, "Short description is required").trim(),

  startReturnBtnText: z.string().trim().optional(),

  startReturnBtnUrl: z.string().trim().optional(),

  contactSupportBtnText: z.string().trim().optional(),

  contactSupportBtnUrl: z.string().trim().optional(),

  // Feature cards
  features: z.array(featureSchema).optional(),

  // How Returns Work
  howItWorksTitle: z.string().trim().optional(),

  howItWorksDesc: z.string().trim().optional(),

  returnSteps: z.array(returnStepSchema).optional(),

  // Eligible for Return
  eligibleTitle: z.string().trim().optional(),

  eligibleDesc: z.string().trim().optional(),

  eligibleItems: z.array(z.string().trim()).optional(),

  // Non Returnable
  nonReturnableTitle: z.string().trim().optional(),

  nonReturnableDesc: z.string().trim().optional(),

  nonReturnableItems: z.array(z.string().trim()).optional(),

  // Refund Timeline
  refundTimelineTitle: z.string().trim().optional(),

  refundTimelineDesc: z.string().trim().optional(),

  refundTimeline: z.array(refundTimelineSchema).optional(),

  // Refund Processing
  refundProcessingTitle: z.string().trim().optional(),

  refundProcessingDesc: z.string().trim().optional(),

  isDeleted: z.boolean().optional(),
});

// =========================
// UPDATE
// =========================

export const updateReturnPolicySchema = returnPolicySchema.partial();
