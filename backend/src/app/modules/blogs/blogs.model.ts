import mongoose, { Schema } from "mongoose";
import { IBlogs } from "./blogs.interface";

const blogsSchema: Schema = new Schema(
  {
    category: {
      type: Schema.Types.ObjectId,
      ref: "BlogsCategoryModel",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    shortDesc: {
      type: String,
      trim: true,
      default: "",
    },

    author: {
      type: String,
      trim: true,
      default: "",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    QuickTips: {
      type: String,
      default: "",
    },

    blackQuote: {
      type: String,
      default: "",
    },

    tags: {
      type: String,
      default: "",
    },

    writtenBy: {
      type: String,
      default: "",
    },

    writtenByImage: {
      type: String,
      default: "",
    },

    writtenByDesc: {
      type: String,
      default: "",
    },

    metaTitle: {
      type: String,
      default: "",
    },

    metaDesc: {
      type: String,
      default: "",
    },

    metaTags: {
      type: String,
      default: "",
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

export const BlogsModel = mongoose.model<IBlogs>("BlogsModel", blogsSchema);
