import mongoose, { Schema } from "mongoose";
import { IReturnPolicy } from "./returnPolicy.interface";

const featureSchema = new Schema(
  {
    icon: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const returnStepSchema = new Schema(
  {
    stepNo: {
      type: String,
      default: "",
      trim: true,
    },

    icon: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const timelineSchema = new Schema(
  {
    stepNo: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    _id: false,
  },
);

const returnPolicySchema: Schema<IReturnPolicy> = new Schema(
  {
    // =========================
    // HERO SECTION
    // =========================
    badgeTitle: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDesc: {
      type: String,
      required: true,
      trim: true,
    },

    startReturnBtnText: {
      type: String,
      default: "Start A Return",
      trim: true,
    },

    startReturnBtnUrl: {
      type: String,
      default: "",
      trim: true,
    },

    contactSupportBtnText: {
      type: String,
      default: "Contact Support",
      trim: true,
    },

    contactSupportBtnUrl: {
      type: String,
      default: "",
      trim: true,
    },

    // =========================
    // FEATURE CARDS
    // =========================
    features: {
      type: [featureSchema],
      default: [],
    },

    // =========================
    // HOW RETURNS WORK
    // =========================
    howItWorksTitle: {
      type: String,
      default: "",
      trim: true,
    },

    howItWorksDesc: {
      type: String,
      default: "",
      trim: true,
    },

    returnSteps: {
      type: [returnStepSchema],
      default: [],
    },

    // =========================
    // ELIGIBLE FOR RETURN
    // =========================
    eligibleTitle: {
      type: String,
      default: "",
      trim: true,
    },

    eligibleDesc: {
      type: String,
      default: "",
      trim: true,
    },

    eligibleItems: {
      type: [String],
      default: [],
    },

    // =========================
    // NON RETURNABLE PRODUCTS
    // =========================
    nonReturnableTitle: {
      type: String,
      default: "",
      trim: true,
    },

    nonReturnableDesc: {
      type: String,
      default: "",
      trim: true,
    },

    nonReturnableItems: {
      type: [String],
      default: [],
    },

    // =========================
    // REFUND TIMELINE
    // =========================
    refundTimelineTitle: {
      type: String,
      default: "",
      trim: true,
    },

    refundTimelineDesc: {
      type: String,
      default: "",
      trim: true,
    },

    refundTimeline: {
      type: [timelineSchema],
      default: [],
    },

    // =========================
    // REFUND PROCESSING BOX
    // =========================
    refundProcessingTitle: {
      type: String,
      default: "",
      trim: true,
    },

    refundProcessingDesc: {
      type: String,
      default: "",
      trim: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: function (doc, ret: any) {
        if (ret.createdAt) {
          ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }

        if (ret.updatedAt) {
          ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
        }

        return ret;
      },
    },
  },
);

export const ReturnPolicy = mongoose.model<IReturnPolicy>(
  "ReturnPolicy",
  returnPolicySchema,
);
