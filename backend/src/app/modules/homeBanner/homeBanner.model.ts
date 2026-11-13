import mongoose, { Schema } from "mongoose";
import { IHomeBanner } from "./homeBanner.interface";

const homeBannerSchema: Schema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    shortDesc: {
      type: String,
      trim: true,
    },
    bgVideo: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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
        ret.createdAt = new Date(ret.createdAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        ret.updatedAt = new Date(ret.updatedAt).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });

        return ret;
      },
    },
  },
);

export const HomeBanner = mongoose.model<IHomeBanner>(
  "HomeBanner",
  homeBannerSchema,
);
