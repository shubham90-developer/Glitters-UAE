import mongoose, { Schema } from "mongoose";
import { ICareerEnquiry } from "./careerEnquiry.interface";

const careerEnquirySchema: Schema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    emailAddress: {
      type: String,
    },
    phone: {
      type: String,
    },
    currentPosition: {
      type: String,
    },
    experience: {
      type: String,
    },
    currentLocation: {
      type: String,
    },
    expectedSalary: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
    resume: {
      type: String,
    },
    coverLetter: {
      type: String,
    },
    message: {
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

export const CareerEnquiry = mongoose.model<ICareerEnquiry>(
  "CareerEnquiry",
  careerEnquirySchema,
);
