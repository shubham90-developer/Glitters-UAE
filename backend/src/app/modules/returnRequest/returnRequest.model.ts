import mongoose, { Schema } from "mongoose";
import { IReturnRequest } from "./returnRequest.interface";

const returnRequestSchema: Schema<IReturnRequest> = new Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      trim: true,
    },

    emailAddress: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    reason: {
      type: String,
      required: true,
      trim: true,
    },

    additionalDetails: {
      type: String,
      default: "",
      trim: true,
    },

    isConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "received", "refunded"],
      default: "pending",
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

export const ReturnRequest = mongoose.model<IReturnRequest>(
  "ReturnRequest",
  returnRequestSchema,
);
