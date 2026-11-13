import { Document, Types } from "mongoose";

export interface IReview extends Document {
  product: Types.ObjectId;
  user: Types.ObjectId;

  name: string;
  email: string;

  rating: number;
  reviewTitle: string;
  review: string;

  // optional photo uploaded by the customer (Cloudinary URL + public id)
  image: string;
  imageId: string;

  isVerified: boolean;
  helpfulCount: number;

  createdAt: Date;
  updatedAt: Date;
}

export interface IReviewSummary {
  total: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}
