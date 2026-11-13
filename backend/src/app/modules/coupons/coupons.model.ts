import mongoose, { Schema } from "mongoose";
import { ICoupons } from "./coupons.interface";

const couponsSchema: Schema = new Schema(
  {
    couponName: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      trim: true,
    },
    couponCode: {
      type: String,
      trim: true,
    },
    couponAmount: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
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

export const Coupons = mongoose.model<ICoupons>("Coupons", couponsSchema);
