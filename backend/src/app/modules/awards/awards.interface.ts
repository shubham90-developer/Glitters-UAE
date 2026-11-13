import { Document } from "mongoose";

export interface IAwards extends Document {
  image: string;
  year: string;
  title: string;
  shortDesc: string;
}
