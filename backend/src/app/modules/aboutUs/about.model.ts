import mongoose, { Schema } from "mongoose";
import { IAboutUs } from "./about.interface";

const aboutUsSchema: Schema<IAboutUs> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    subTitle: {
      type: String,
      trim: true,
      required: true,
    },

    shortDesc: {
      type: String,
      trim: true,
      required: true,
    },

    ProductsCounter: {
      type: String,
      trim: true,
      default: "",
    },

    CustomersCounter: {
      type: String,
      trim: true,
      default: "",
    },

    DeliveriesCounter: {
      type: String,
      trim: true,
      default: "",
    },

    Rating: {
      type: String,
      trim: true,
      default: "",
    },

    trustedTitle: {
      type: String,
      trim: true,
      default: "",
    },

    trustedDesc: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // OUR STORY SECTION
    // =========================
    storySubTitle: {
      type: String,
      trim: true,
      default: "",
    },

    storyTitle: {
      type: String,
      trim: true,
      default: "",
    },

    storyDesc: {
      type: String,
      trim: true,
      default: "",
    },

    storySecondDesc: {
      type: String,
      trim: true,
      default: "",
    },

    storyImg: {
      type: String,
      trim: true,
      default: "",
    },

    customerFirstTitle: {
      type: String,
      trim: true,
      default: "",
    },

    customerFirstDesc: {
      type: String,
      trim: true,
      default: "",
    },

    qualityFocusTitle: {
      type: String,
      trim: true,
      default: "",
    },

    qualityFocusDesc: {
      type: String,
      trim: true,
      default: "",
    },

    transparentPricingTitle: {
      type: String,
      trim: true,
      default: "",
    },

    transparentPricingDesc: {
      type: String,
      trim: true,
      default: "",
    },

    reliableSupportTitle: {
      type: String,
      trim: true,
      default: "",
    },

    reliableSupportDesc: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // OUR VALUES
    // =========================
    valuesTitle: {
      type: String,
      trim: true,
      default: "",
    },

    valuesSubTitle: {
      type: String,
      trim: true,
      default: "",
    },

    CustomerFirstTitle: {
      type: String,
      trim: true,
      default: "",
    },

    CustomerFirstDesc: {
      type: String,
      trim: true,
      default: "",
    },

    TrustSecurityTitle: {
      type: String,
      trim: true,
      default: "",
    },

    TrustSecurityDesc: {
      type: String,
      trim: true,
      default: "",
    },

    QualityTitle: {
      type: String,
      trim: true,
      default: "",
    },

    QualityDesc: {
      type: String,
      trim: true,
      default: "",
    },

    ContinuousImprovementTitle: {
      type: String,
      trim: true,
      default: "",
    },

    ContinuousImprovementDesc: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // WHY SHOP WITH US
    // =========================
    whyShopSubTitle: {
      type: String,
      trim: true,
      default: "",
    },

    whyShopTitle: {
      type: String,
      trim: true,
      default: "",
    },

    whyShopDesc: {
      type: String,
      trim: true,
      default: "",
    },

    wideSelectionTitle: {
      type: String,
      trim: true,
      default: "",
    },

    wideSelectionDesc: {
      type: String,
      trim: true,
      default: "",
    },

    fastDeliveryTitle: {
      type: String,
      trim: true,
      default: "",
    },

    fastDeliveryDesc: {
      type: String,
      trim: true,
      default: "",
    },

    secureCheckoutTitle: {
      type: String,
      trim: true,
      default: "",
    },

    secureCheckoutDesc: {
      type: String,
      trim: true,
      default: "",
    },

    easyReturnsTitle: {
      type: String,
      trim: true,
      default: "",
    },

    easyReturnsDesc: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // OUR PROMISE
    // =========================
    promiseTitle: {
      type: String,
      trim: true,
      default: "",
    },

    promiseDesc: {
      type: String,
      trim: true,
      default: "",
    },

    promisePoint1: {
      type: String,
      trim: true,
      default: "",
    },

    promisePoint2: {
      type: String,
      trim: true,
      default: "",
    },

    promisePoint3: {
      type: String,
      trim: true,
      default: "",
    },

    promisePoint4: {
      type: String,
      trim: true,
      default: "",
    },

    // =========================
    // COMMON
    // =========================
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

export const AboutUs = mongoose.model<IAboutUs>("AboutUs", aboutUsSchema);
