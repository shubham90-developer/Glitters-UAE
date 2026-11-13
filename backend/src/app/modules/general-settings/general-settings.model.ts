import mongoose, { Schema } from "mongoose";
import { IGeneralSettings } from "./general-settings.interface";

const GeneralSettingsSchema: Schema<IGeneralSettings> = new Schema(
  {
    logo: {
      type: String,
      default: "",
      trim: true,
    },

    favicon: {
      type: String,
      default: "",
      trim: true,
    },

    footerImg: {
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

    topHeaderTitle: {
      type: String,
      default: "",
      trim: true,
    },

    footerInfo: {
      type: String,
      default: "",
      trim: true,
    },

    footerCopyrights: {
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

export const GeneralSettings = mongoose.model<IGeneralSettings>(
  "GeneralSettings",
  GeneralSettingsSchema,
);
