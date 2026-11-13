import { Document } from "mongoose";

export interface IColors extends Document {
  colorName: string;
  hexCode: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
