import { Document } from "mongoose";

export interface IClients extends Document {
  logo: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
