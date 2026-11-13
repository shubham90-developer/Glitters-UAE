import { Document } from "mongoose";

export interface ICounter extends Document {
  title: string;
  subTitle: string;
  happyCustomers: string;
  products: string;
  ordersDelivered: string;
  customerRating: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
