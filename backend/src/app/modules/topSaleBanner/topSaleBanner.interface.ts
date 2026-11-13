import { Document } from "mongoose";

export interface ITopSaleBanner extends Document {
  offerBannerImg1: string;
  offerBannerImg2: string;
  offerBannerImg3: string;

  offerBannerLink1?: string;
  offerBannerLink2?: string;
  offerBannerLink3?: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
