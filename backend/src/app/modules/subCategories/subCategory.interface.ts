import { Document, Types } from "mongoose";

export interface ISubCategory extends Document {
  category: Types.ObjectId;
  img: string;
  subCategoryName: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
