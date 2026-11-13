import { Document } from "mongoose";

export interface ICurrentOpenings extends Document {
  jobID: string;
  jobTitle: string;
  shortDesc: string;
  location: string;
  jobType: string;
  experience: string;
  dept: string;
  roles: string;
  salary: string;
  openings: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
