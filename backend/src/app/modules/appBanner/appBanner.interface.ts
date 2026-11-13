import { Document } from "mongoose";

export interface IAppBanner extends Document {
  AppBanner: string;
  status: "active" | "inactive";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
