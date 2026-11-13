import mongoose, { Schema } from "mongoose";
import { IColors } from "./colors.interface";

const colorsSchema: Schema = new Schema(
  {
    colorName: {
      type: String,
      required: true,
      trim: true,
    },
    hexCode: {
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

export const Colors = mongoose.model<IColors>("Colors", colorsSchema);
