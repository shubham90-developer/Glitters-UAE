import mongoose, { Schema } from "mongoose";
import { ITopSaleBanner } from "./topSaleBanner.interface";

const topSaleBannerSchema: Schema<ITopSaleBanner> = new Schema(
  {
    offerBannerImg1: {
      type: String,

      trim: true,
    },
    offerBannerImg2: {
      type: String,

      trim: true,
    },
    offerBannerImg3: {
      type: String,

      trim: true,
    },

    offerBannerLink1: {
      type: String,
      default: "",
      trim: true,
    },
    offerBannerLink2: {
      type: String,
      default: "",
      trim: true,
    },
    offerBannerLink3: {
      type: String,
      default: "",
      trim: true,
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

export const TopSaleBanner = mongoose.model<ITopSaleBanner>(
  "TopSaleBanner",
  topSaleBannerSchema,
);
