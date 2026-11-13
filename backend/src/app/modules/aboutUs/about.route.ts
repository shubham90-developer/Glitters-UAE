import express from "express";
import { upload } from "../../config/cloudinary";
import { createAboutUs, getAboutUs, updateAboutUs } from "./about.controller";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    {
      name: "storyImg",
      maxCount: 1,
    },
  ]),
  createAboutUs,
);

router.get("/", getAboutUs);

router.put(
  "/:id",
  upload.fields([
    {
      name: "storyImg",
      maxCount: 1,
    },
  ]),
  updateAboutUs,
);

export const aboutUsRouter = router;
