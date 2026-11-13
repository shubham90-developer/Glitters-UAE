import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createGeneralSettings,
  deleteGeneralSettings,
  getAllGeneralSettings,
  getGeneralSettingsById,
  updateGeneralSettings,
} from "./general-settings.controller";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "logo", maxCount: 1 },
  { name: "favicon", maxCount: 1 },
  { name: "footerImg", maxCount: 1 },
]);

router.post("/", uploadFields, createGeneralSettings);

router.get("/", getAllGeneralSettings);

router.get("/:id", getGeneralSettingsById);

router.put("/:id", uploadFields, updateGeneralSettings);

router.delete("/:id", deleteGeneralSettings);

export const generalSettingsRouter = router;
