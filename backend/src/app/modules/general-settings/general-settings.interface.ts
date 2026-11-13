import { Document } from "mongoose";

export interface IGeneralSettings extends Document {
  logo?: string;
  favicon?: string;
  footerImg?: string;

  mobileNo?: string;
  alternateMobileNo?: string;

  mail?: string;
  alternateEmail?: string;

  address?: string;
  addressIframe?: string;
  workingHrs?: string;

  facebook?: string;
  instagram?: string;
  youtube?: string;
  linkedin?: string;
  twitter?: string;
  whatsApp?: string;

  topHeaderTitle?: string;
  footerInfo?: string;
  footerCopyrights?: string;

  googlePlayUrl?: string;
  appStoreUrl?: string;

  username?: string;
  password?: string;

  createdAt: Date;
  updatedAt: Date;
}
