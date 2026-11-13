import mongoose, { Schema } from "mongoose";
import { IAddToCart } from "./addToCart.interface";

const addToCartSchema: Schema<IAddToCart> = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // _id of the selected variant (color + size) inside product.variants
    variantId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 1,
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

export const AddToCart = mongoose.model<IAddToCart>(
  "AddToCart",
  addToCartSchema,
);
