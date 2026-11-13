import { Document } from "mongoose";

export interface ICategory extends Document {
  img: string;
  categoryName: string;
  categoryDesc: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
