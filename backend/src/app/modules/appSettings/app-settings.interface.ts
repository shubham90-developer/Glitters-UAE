import { Document } from "mongoose";

export interface IAppSettings extends Document {
  applogo?: string;
  appName?: string;
  footerImg?: string;
  footerName?: string;

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

  googlePlayUrl?: string;
  appStoreUrl?: string;

  username?: string;
  password?: string;

  createdAt: Date;
  updatedAt: Date;
}
