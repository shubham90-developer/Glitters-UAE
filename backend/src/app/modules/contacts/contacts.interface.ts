import { Document } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;

  subject: "orders" | "shipping" | "payments" | "returns" | "products";

  orderNo?: string;

  message: string;

  status: "new" | "in-progress" | "resolved";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
