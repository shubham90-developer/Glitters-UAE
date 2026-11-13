import { Document } from "mongoose";

export interface ICareerEnquiry extends Document {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phone: string;
  currentPosition: string;
  experience: string;
  currentLocation: string;
  expectedSalary: string;
  linkedIn: string;
  resume: string;
  coverLetter: string;
  message: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
