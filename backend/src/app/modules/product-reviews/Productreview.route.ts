import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";
import { upload } from "../../config/cloudinary"; // existing uploader

import {
  createReview,
  deleteReview,
  getAllReviews,
  getMyReview,
  getProductReviews,
} from "./Productreview.controller";

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.get("/product/:productId/mine", authMiddleware, getMyReview);
router.post(
  "/product/:productId",
  authMiddleware,
  upload.single("image"),
  createReview,
);

router.get("/", getAllReviews);
router.delete("/:id", deleteReview);

export const productReviewRouter = router;
