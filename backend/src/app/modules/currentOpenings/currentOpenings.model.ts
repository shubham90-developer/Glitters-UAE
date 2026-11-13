import mongoose, { Schema } from "mongoose";
import { ICurrentOpenings } from "./currentOpenings.interface";

const currentOpeningsSchema: Schema<ICurrentOpenings> = new Schema(
  {
    jobID: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },

    shortDesc: {
      type: String,
      default: "",
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    jobType: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    dept: {
      type: String,
      default: "",
      trim: true,
    },

    roles: {
      type: String,
      default: "",
      trim: true,
    },

    salary: {
      type: String,
      default: "",
      trim: true,
    },

    openings: {
      type: String,
      default: "",
      trim: true,
    },

    responsibilities: {
      type: String,
      default: "",
      trim: true,
    },

    requirements: {
      type: String,
      default: "",
      trim: true,
    },

    benefits: {
      type: String,
      default: "",
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

export const CurrentOpenings = mongoose.model<ICurrentOpenings>(
  "CurrentOpenings",
  currentOpeningsSchema,
);
