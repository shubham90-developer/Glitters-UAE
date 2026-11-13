import { Document } from "mongoose";

export interface IReturnPolicyFeature {
  icon: string;
  title: string;
  desc: string;
}

export interface IReturnPolicyStep {
  stepNo: string;
  icon: string;
  title: string;
  desc: string;
}

export interface IReturnPolicyTimeline {
  stepNo: string;
  title: string;
  desc: string;
}

export interface IReturnPolicy extends Document {
  badgeTitle: string;
  title: string;
  shortDesc: string;

  startReturnBtnText: string;
  startReturnBtnUrl: string;

  contactSupportBtnText: string;
  contactSupportBtnUrl: string;

  features: IReturnPolicyFeature[];

  howItWorksTitle: string;
  howItWorksDesc: string;
  returnSteps: IReturnPolicyStep[];

  eligibleTitle: string;
  eligibleDesc: string;
  eligibleItems: string[];

  nonReturnableTitle: string;
  nonReturnableDesc: string;
  nonReturnableItems: string[];

  refundTimelineTitle: string;
  refundTimelineDesc: string;
  refundTimeline: IReturnPolicyTimeline[];

  refundProcessingTitle: string;
  refundProcessingDesc: string;

  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
