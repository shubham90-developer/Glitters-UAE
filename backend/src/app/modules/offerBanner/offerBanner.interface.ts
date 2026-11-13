import { Document, Types } from "mongoose";

export interface IOfferBanner extends Document {
  offerBannerImg: string;

  category?: Types.ObjectId;

  subCategory?: Types.ObjectId;

  redirectUrl?: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
