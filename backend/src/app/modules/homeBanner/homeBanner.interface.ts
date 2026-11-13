import { Document } from "mongoose";

export interface IHomeBanner extends Document {
  title: string;
  subTitle: string;
  shortDesc: string;
  bgVideo: string;
  status: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
