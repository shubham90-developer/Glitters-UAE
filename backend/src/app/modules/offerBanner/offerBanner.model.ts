import mongoose, { Schema } from "mongoose";
import { IOfferBanner } from "./offerBanner.interface";

const offerBannerSchema: Schema<IOfferBanner> = new Schema(
  {
    offerBannerImg: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    redirectUrl: {
      type: String,
      trim: true,
      default: "",
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

export const OfferBanner = mongoose.model<IOfferBanner>(
  "OfferBanner",
  offerBannerSchema,
);
