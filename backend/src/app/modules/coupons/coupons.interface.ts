import { Document } from "mongoose";

export interface ICoupons extends Document {
  couponName: string;
  subTitle: string;
  couponCode: string;
  couponAmount: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
