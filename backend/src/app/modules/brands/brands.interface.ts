import { Document } from "mongoose";

export interface IBrands extends Document {
  name: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
