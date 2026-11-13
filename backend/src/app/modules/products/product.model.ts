import mongoose, { Schema } from "mongoose";
import { IProducts } from "./product.interface";

const productVariantSchema = new Schema(
  {
    size: {
      type: Schema.Types.ObjectId,
      ref: "Size",
    },

    color: {
      type: Schema.Types.ObjectId,
      ref: "Colors",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    delPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // Multiple images per variant
    images: {
      type: [String],
      default: [],
    },

    // Legacy single image. Kept in sync with images[0].
    image: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    _id: true,
  },
);

const productSpecificationSchema = new Schema(
  {
    specificationName: {
      type: String,
      required: true,
      trim: true,
    },

    value: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  },
);

const productReviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: { type: String, required: true, trim: true },

    email: { type: String, required: true, trim: true, lowercase: true },

    rating: { type: Number, required: true, min: 1, max: 5 },

    reviewTitle: { type: String, required: true, trim: true },

    review: { type: String, required: true, trim: true },

    isVerified: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    helpfulCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  },
);

const productSchema: Schema<IProducts> = new Schema(
  {
    productName: { type: String, required: true, trim: true },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: Schema.Types.ObjectId,
      ref: "SubCategory",
      default: null,
    },

    material: {
      type: Schema.Types.ObjectId,
      ref: "Material",
      default: null,
    },

    section: {
      type: String,
      enum: ["New Offers", "Popular Products", "New Arrivals"],
      default: null,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "Brands",
      default: null,
    },

    dealOfTheDay: { type: Boolean, default: false },

    // Deal of the Day window (only used when dealOfTheDay is true)
    dealStartTime: { type: Date, default: null },
    dealEndTime: { type: Date, default: null },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupons",
      default: null,
    },

    tags: { type: [String], default: [] },

    videoUrl: { type: String, trim: true, default: "" },

    variants: {
      type: [productVariantSchema],
      required: true,
      default: [],
    },

    shortDesc: { type: String, required: true, trim: true },

    desc: { type: String, required: true, trim: true },

    additionalInformation: { type: String, trim: true, default: "" },

    shippingReturnPolicy: { type: String, required: true, trim: true },

    specifications: { type: [productSpecificationSchema], default: [] },

    reviews: { type: [productReviewSchema], default: [] },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    isDeleted: { type: Boolean, default: false },
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

productSchema.index({ productName: "text" });

productSchema.index({
  category: 1,
  subCategory: 1,
  status: 1,
  isDeleted: 1,
});

productSchema.index({ brand: 1 });

productSchema.index({ section: 1 });

productSchema.index({ dealOfTheDay: 1 });

export const Product = mongoose.model<IProducts>("Product", productSchema);
