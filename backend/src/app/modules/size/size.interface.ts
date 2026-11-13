import { Document } from "mongoose";

export interface ISize extends Document {
  size: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
