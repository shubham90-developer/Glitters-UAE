import { Document } from "mongoose";

export interface IBlogCategory extends Document {
  categoryName: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
