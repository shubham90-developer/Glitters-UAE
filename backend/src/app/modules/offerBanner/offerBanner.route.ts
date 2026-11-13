import express from "express";

import {
  createOfferBanner,
  deleteOfferBanner,
  getAllOfferBannerData,
  getOfferBannerById,
  updateOfferBanner,
} from "./offerBanner.controller";

import { upload } from "../../config/cloudinary";

const router = express.Router();

router.post("/", upload.single("offerBannerImg"), createOfferBanner);

router.get("/", getAllOfferBannerData);

router.get("/:id", getOfferBannerById);

router.put("/:id", upload.single("offerBannerImg"), updateOfferBanner);

router.delete("/:id", deleteOfferBanner);

export const offerBannerRouter = router;
