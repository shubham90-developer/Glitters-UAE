import mongoose, { Schema } from "mongoose";
import { ICareerInfo } from "./careerInfo.interface";

const employeeBenefitSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: false,
  },
);

const hiringProcessSchema = new Schema(
  {
    step: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
);

// =========================
// CAREER INFO
// =========================
const careerInfoSchema: Schema<ICareerInfo> = new Schema(
  {
    // =========================
    // HERO SECTION
    // =========================
    badgeText: {
      type: String,
      trim: true,
      default: "",
    },

    heroTitle: {
      type: String,
      trim: true,
      default: "",
    },

    heroHighlight: {
      type: String,
      trim: true,
      default: "",
    },

    heroDescription: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // EMPLOYEE BENEFITS
    // =========================
    benefitsLabel: {
      type: String,
      trim: true,
      default: "",
    },

    benefitsTitle: {
      type: String,
      trim: true,
      default: "",
    },

    employeeBenefits: {
      type: [employeeBenefitSchema],
      default: [],
    },

    // =========================
    // CULTURE SECTION
    // =========================
    cultureTitle: {
      type: String,
      trim: true,
      default: "",
    },

    cultureDescription: {
      type: String,
      trim: true,
      default: "",
    },

    culturePoints: {
      type: [String],
      default: [],
    },

    // =========================
    // HIRING PROCESS
    // =========================
    hiringProcessLabel: {
      type: String,
      trim: true,
      default: "",
    },

    hiringProcessTitle: {
      type: String,
      trim: true,
      default: "",
    },

    hiringProcess: {
      type: [hiringProcessSchema],
      default: [],
    },

    // =========================
    // DELETE STATUS
    // =========================
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

export const CareerInfo = mongoose.model<ICareerInfo>(
  "CareerInfo",
  careerInfoSchema,
);
