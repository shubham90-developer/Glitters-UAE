import mongoose, { Schema } from "mongoose";
import { IAppSettings } from "./app-settings.interface";

const AppSettingsSchema: Schema<IAppSettings> = new Schema(
  {
    applogo: {
      type: String,
      default: "",
      trim: true,
    },

    appName: {
      type: String,
      default: "",
      trim: true,
    },

    footerImg: {
      type: String,
      default: "",
      trim: true,
    },
    footerName: {
      type: String,
      default: "",
      trim: true,
    },

    mobileNo: {
      type: String,
      default: "",
      trim: true,
    },

    alternateMobileNo: {
      type: String,
      default: "",
      trim: true,
    },

    mail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    alternateEmail: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
    },

    addressIframe: {
      type: String,
      default: "",
    },

    workingHrs: {
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

    youtube: {
      type: String,
      default: "",
      trim: true,
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    twitter: {
      type: String,
      default: "",
      trim: true,
    },

    whatsApp: {
      type: String,
      default: "",
      trim: true,
    },

    googlePlayUrl: {
      type: String,
      default: "",
      trim: true,
    },

    appStoreUrl: {
      type: String,
      default: "",
      trim: true,
    },

    username: {
      type: String,
      default: "",
      trim: true,
    },

    password: {
      type: String,
      default: "",
      select: false,
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: function (doc, ret: any) {
        delete ret.password;
        delete ret.__v;

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

export const AppSettings = mongoose.model<IAppSettings>(
  "AppSettings",
  AppSettingsSchema,
);
