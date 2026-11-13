import { Document } from "mongoose";

export interface ITestimonials extends Document {
  image: string;
  name: string;
  designation: string;
  description: string;
  rating: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
