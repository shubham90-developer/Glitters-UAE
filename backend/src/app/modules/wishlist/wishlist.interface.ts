import { Document, Types } from "mongoose";

export interface IWishlist extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
