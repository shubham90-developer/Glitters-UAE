import { Document } from "mongoose";

export interface IPrivacyPolicy extends Document {
  badgeTitle: string;
  title: string;
  shortDesc: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
