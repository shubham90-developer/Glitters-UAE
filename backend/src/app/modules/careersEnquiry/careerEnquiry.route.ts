import express from "express";
import {
  createCareerEnquiry,
  deleteCareerEnquiry,
  getAllCareerEnquiryData,
  getCareerEnquiryById,
  updateCareerEnquiry,
} from "./careerEnquiry.controller";
import { upload } from "../../config/cloudinary";

const router = express.Router();

router.post("/", upload.single("resume"), createCareerEnquiry);

router.get("/", getAllCareerEnquiryData);

router.get("/:id", getCareerEnquiryById);

router.put("/:id", upload.single("resume"), updateCareerEnquiry);

router.delete("/:id", deleteCareerEnquiry);

export const careerEnquiryRouter = router;
