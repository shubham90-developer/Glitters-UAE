import { Document, Types } from "mongoose";

export interface IAddToCart extends Document {
  product: Types.ObjectId;
  variantId?: Types.ObjectId | null;
  quantity: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
