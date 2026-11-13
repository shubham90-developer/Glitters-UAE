import express from "express";
import {
  createHomeBanner,
  deleteHomeBannerById,
  getAllHomeBanner,
  homeBannerById,
  updateHomeBannerById,
} from "./homeBanner.controller";
import { upload } from "../../config/cloudinary";
const router = express.Router();

router.post("/", upload.single("bgVideo"), createHomeBanner);

router.get("/", getAllHomeBanner);

router.get("/:id", homeBannerById);

router.put("/:id", upload.single("bgVideo"), updateHomeBannerById);

router.delete("/:id", deleteHomeBannerById);

export const homeBannerRouter = router;
