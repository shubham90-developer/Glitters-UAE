import { Document, Types } from "mongoose";

export interface IReturnRequest extends Document {
  orderNumber: string;
  emailAddress: string;

  product: Types.ObjectId;
  reason: string;

  additionalDetails: string;

  isConfirmed: boolean;

  status: "pending" | "approved" | "rejected" | "received" | "refunded";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
