import mongoose, { Schema } from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema: Schema<ICategory> = new Schema(
  {
    img: {
      type: String,
      required: true,
      trim: true,
    },

    categoryName: {
      type: String,
      required: true,
      trim: true,
    },

    categoryDesc: {
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

export const Category = mongoose.model<ICategory>("Category", categorySchema);
