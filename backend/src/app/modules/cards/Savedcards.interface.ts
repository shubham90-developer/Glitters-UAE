import { Document, Types } from "mongoose";

export interface ISavedCard extends Document {
  user: Types.ObjectId;
  type: "Visa" | "Mastercard" | "RuPay" | "American Express";
  last4: string;
  expiry: string; // MM/YY
  holder: string;
  isDefault: boolean;
  gatewayToken?: string; // token from Razorpay (never the real card number)
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
