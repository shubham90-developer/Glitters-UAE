import { Document } from "mongoose";

export interface ICertificates extends Document {
  certificatesImage: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
