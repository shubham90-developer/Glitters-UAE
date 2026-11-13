import mongoose, { Schema } from "mongoose";
import { ITestimonials } from "./testimonials.interface";

const testimonialSchema: Schema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    designation: {
      type: String,
    },
    description: {
      type: String,
    },
    rating: {
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

export const Testimonials = mongoose.model<ITestimonials>(
  "Testimonials",
  testimonialSchema,
);
