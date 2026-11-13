import { Document } from "mongoose";

export interface IStoreLocation extends Document {
  badgeTitle: string;
  img: string;
  storeName: string;
  rating: string;
  shortDesc: string;
  address: string;
  phone: string;
  email: string;
  workingHours: string;
  qrcode: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  status: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
