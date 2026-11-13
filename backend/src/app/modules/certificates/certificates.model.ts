import mongoose, { Schema } from "mongoose";
import { ICertificates } from "./certificates.interface";

const certificatesSchema: Schema = new Schema(
  {
    certificatesImage: {
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

export const Certificates = mongoose.model<ICertificates>(
  "Certificates",
  certificatesSchema,
);
