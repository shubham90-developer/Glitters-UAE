import { Document } from "mongoose";

export interface IHiringProcessItem {
  step: string;
  title: string;
  description: string;
}

export interface IEmployeeBenefitItem {
  title: string;
  icon?: string;
}

export interface ICareerInfo extends Document {
  // Hero Section
  badgeText?: string;
  heroTitle?: string;
  heroHighlight?: string;
  heroDescription?: string;

  // Employee Benefits
  benefitsLabel?: string;
  benefitsTitle?: string;
  employeeBenefits: IEmployeeBenefitItem[];

  // Culture Section
  cultureTitle?: string;
  cultureDescription?: string;
  culturePoints: string[];

  // Hiring Process
  hiringProcessLabel?: string;
  hiringProcessTitle?: string;
  hiringProcess: IHiringProcessItem[];

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
