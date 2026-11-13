import { Document, Types } from "mongoose";

export interface IStoreEnquiry extends Document {
  storeName: Types.ObjectId;
  fullName: string;
  phone: string;
  email: string;
  msg: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
