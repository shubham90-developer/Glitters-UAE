import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createAppBanner,
  deleteAppBanner,
  getAllAppBanner,
  getAppBannerById,
  updateAppBanner,
} from "./appBanner.controller";

const router = express.Router();

// create
router.post("/", upload.single("AppBanner"), createAppBanner);

// get
router.get("/", getAllAppBanner);

// get signle
router.get("/:id", getAppBannerById);

// update
router.put("/:id", upload.single("AppBanner"), updateAppBanner);

// delete
router.delete("/:id", deleteAppBanner);

export const appBannerRouter = router;
