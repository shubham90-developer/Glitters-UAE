import { Document, Types } from "mongoose";

export interface IProductVariant {
  size?: Types.ObjectId;
  color: Types.ObjectId;

  price: number;
  delPrice: number;
  discount: number;
  stock: number;

  // Multiple images per variant
  images: string[];

  // Legacy single image. Always mirrors images[0] so old code keeps working.
  image?: string;
}

export interface IProductSpecification {
  specificationName: string;
  value: string;
}

export interface IProductReview {
  user?: Types.ObjectId;

  name: string;
  email: string;

  rating: number;
  reviewTitle: string;
  review: string;

  isVerified?: boolean;

  status?: "pending" | "approved" | "rejected";

  helpfulCount?: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProducts extends Document {
  productName: string;

  category: Types.ObjectId;
  subCategory?: Types.ObjectId;

  material?: Types.ObjectId;

  section?: "New Offers" | "Popular Products" | "New Arrivals";

  brand?: Types.ObjectId;

  dealOfTheDay: boolean;

  // Deal of the Day window (only used when dealOfTheDay is true)
  dealStartTime?: Date | null;
  dealEndTime?: Date | null;

  coupon?: Types.ObjectId;

  tags?: string[];

  videoUrl?: string;

  variants: IProductVariant[];

  shortDesc: string;
  desc: string;

  additionalInformation?: string;

  shippingReturnPolicy: string;

  specifications: IProductSpecification[];

  reviews?: IProductReview[];

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
