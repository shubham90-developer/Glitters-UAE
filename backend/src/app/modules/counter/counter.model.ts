import mongoose, { Schema } from "mongoose";
import { ICounter } from "./counter.interface";

const counterSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
    },
    happyCustomers: {
      type: String,
      required: true,
      trim: true,
    },
    products: {
      type: String,
      required: true,
      trim: true,
    },
    ordersDelivered: {
      type: String,
      required: true,
      trim: true,
    },
    customerRating: {
      type: String,
      required: true,
      trim: true,
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

export const Counter = mongoose.model<ICounter>("Counter", counterSchema);
