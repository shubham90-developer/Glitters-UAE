import { Document } from "mongoose";

export interface ISEOPages extends Document {
  productListBgImages: string[];
  wishListBgImages: string[];

  status: "active" | "inactive";
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
