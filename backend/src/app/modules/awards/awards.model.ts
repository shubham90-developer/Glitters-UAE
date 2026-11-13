import mongoose, { Schema } from "mongoose";
import { IAwards } from "./awards.interface";

const awardsSchema: Schema = new Schema(
  {
    image: {
      type: String,
    },
    year: {
      type: String,
    },
    title: {
      type: String,
    },
    shortDesc: {
      type: String,
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

export const Awards = mongoose.model<IAwards>("Awards", awardsSchema);
