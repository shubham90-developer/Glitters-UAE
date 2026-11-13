import { Document } from "mongoose";

export interface IFaq extends Document {
  category: "orders" | "shipping" | "payments" | "returns" | "products";
  question: string;
  answer: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
