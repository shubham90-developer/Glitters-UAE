import { Document } from "mongoose";

export interface IMaterial extends Document {
  name: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
