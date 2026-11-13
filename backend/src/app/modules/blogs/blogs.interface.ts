import { Document, Types } from "mongoose";

export interface IBlogs extends Document {
  category: Types.ObjectId;

  title: string;
  shortDesc: string;
  author: string;

  featured: boolean;

  image: string;
  description: string;

  QuickTips: string;
  blackQuote: string;

  tags: string;

  writtenBy: string;
  writtenByImage: string;
  writtenByDesc: string;

  metaTitle: string;
  metaDesc: string;
  metaTags: string;

  status: "active" | "inactive";

  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
