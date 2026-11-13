import mongoose, { Schema } from "mongoose";
import { ISEOPages } from "./seoPages.interface";

const seoPagesSchema: Schema<ISEOPages> = new Schema(
  {
    productListBgImages: {
      type: [String],
      default: [],
    },

    wishListBgImages: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const SEOPages = mongoose.model<ISEOPages>("SEOPages", seoPagesSchema);
