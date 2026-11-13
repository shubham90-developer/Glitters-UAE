import mongoose, { Model, Schema } from "mongoose";

import { IReview } from "./Productreview.interface";

const reviewSchema = new Schema<IReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    reviewTitle: {
      type: String,
      required: true,
      trim: true,
    },

    review: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    imageId: {
      type: String,
      default: "",
    },

    // set to true later when an order module can confirm the purchase
    isVerified: {
      type: Boolean,
      default: false,
    },

    helpfulCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: "glitters_product_reviews",
  },
);

// one review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const ProductReview: Model<IReview> =
  mongoose.models.GlittersProductReview ||
  mongoose.model<IReview>("GlittersProductReview", reviewSchema);
