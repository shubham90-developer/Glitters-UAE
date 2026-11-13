import express from "express";
import {
  createTestimonials,
  deleteTestimonials,
  getAllTestimonials,
  getTestimonialsById,
  updateTestimonials,
} from "./testimonials.controller";
import { upload } from "../../config/cloudinary";

const router = express.Router();

// create
router.post("/", upload.single("image"), createTestimonials);

// get all
router.get("/", getAllTestimonials);

// get single  all
router.get("/:id", getTestimonialsById);

// update
router.put("/:id", upload.single("image"), updateTestimonials);

// delete
router.delete("/:id", deleteTestimonials);

export const testimonialsRouter = router;
