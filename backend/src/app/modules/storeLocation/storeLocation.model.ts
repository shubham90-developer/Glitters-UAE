import mongoose, { Schema } from "mongoose";
import { IStoreLocation } from "./storeLocation.interface";

const storeLocationSchema: Schema<IStoreLocation> = new Schema(
  {
    badgeTitle: {
      type: String,
      required: true,
      trim: true,
    },

    img: {
      type: String,
      required: true,
      trim: true,
    },

    storeName: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: String,
      default: "",
      trim: true,
    },

    shortDesc: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    workingHours: {
      type: String,
      default: "",
      trim: true,
    },

    qrcode: {
      type: String,
      default: "",
      trim: true,
    },

    facebook: {
      type: String,
      default: "",
      trim: true,
    },

    instagram: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    youtube: {
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

export const StoreLocation = mongoose.model<IStoreLocation>(
  "StoreLocation",
  storeLocationSchema,
);
