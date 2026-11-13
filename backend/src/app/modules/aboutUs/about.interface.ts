import { Document } from "mongoose";

export interface IAboutUs extends Document {
  // =========================
  // HERO / ABOUT SECTION
  // =========================
  title: string;
  subTitle: string;
  shortDesc: string;

  ProductsCounter: string;
  CustomersCounter: string;
  DeliveriesCounter: string;
  Rating: string;

  trustedTitle: string;
  trustedDesc: string;

  // =========================
  // OUR STORY SECTION
  // =========================
  storySubTitle: string;
  storyTitle: string;
  storyDesc: string;
  storySecondDesc: string;
  storyImg: string;

  // Story Features
  customerFirstTitle: string;
  customerFirstDesc: string;

  qualityFocusTitle: string;
  qualityFocusDesc: string;

  transparentPricingTitle: string;
  transparentPricingDesc: string;

  reliableSupportTitle: string;
  reliableSupportDesc: string;

  // =========================
  // Our Values
  // =========================
  valuesTitle: string;
  valuesSubTitle: string;

  CustomerFirstTitle: string;
  CustomerFirstDesc: string;

  TrustSecurityTitle: string;
  TrustSecurityDesc: string;

  QualityTitle: string;
  QualityDesc: string;

  ContinuousImprovementTitle: string;
  ContinuousImprovementDesc: string;

  // =========================
  // WHY SHOP WITH US
  // =========================
  whyShopSubTitle: string;
  whyShopTitle: string;
  whyShopDesc: string;

  wideSelectionTitle: string;
  wideSelectionDesc: string;

  fastDeliveryTitle: string;
  fastDeliveryDesc: string;

  secureCheckoutTitle: string;
  secureCheckoutDesc: string;

  easyReturnsTitle: string;
  easyReturnsDesc: string;

  // =========================
  // OUR PROMISE
  // =========================
  promiseTitle: string;
  promiseDesc: string;

  promisePoint1: string;
  promisePoint2: string;
  promisePoint3: string;
  promisePoint4: string;

  // =========================
  // COMMON
  // =========================
  status: "active" | "inactive";
  isDeleted: boolean;

  createdAt: Date;
  updatedAt: Date;
}
