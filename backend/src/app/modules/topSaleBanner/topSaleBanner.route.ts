import express from "express";

import { upload } from "../../config/cloudinary";

import {
  createTopSaleBanner,
  deleteTopSaleBanner,
  getAllTopSaleBannerData,
  getTopSaleBannerById,
  updateTopSaleBanner,
} from "./topSaleBanner.controller";

const router = express.Router();

// ============================================
// MULTIPLE BANNER FILES
// ============================================

const uploadFields = upload.fields([
  {
    name: "offerBannerImg1",
    maxCount: 1,
  },
  {
    name: "offerBannerImg2",
    maxCount: 1,
  },
  {
    name: "offerBannerImg3",
    maxCount: 1,
  },
]);

// ============================================
// CREATE
// ============================================

router.post("/", uploadFields, createTopSaleBanner);

// ============================================
// GET ALL
// ============================================

router.get("/", getAllTopSaleBannerData);

// ============================================
// GET SINGLE
// ============================================

router.get("/:id", getTopSaleBannerById);

// ============================================
// UPDATE
// ============================================

router.put("/:id", uploadFields, updateTopSaleBanner);

// ============================================
// DELETE
// ============================================

router.delete("/:id", deleteTopSaleBanner);

export const topSaleBannerRouter = router;
