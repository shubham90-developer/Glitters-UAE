import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createAppSettings,
  deleteAppSettings,
  getAllAppSettings,
  getAppSettingsById,
  updateAppSettings,
} from "./app-settings.controller";

const router = express.Router();

const uploadFields = upload.fields([
  { name: "applogo", maxCount: 1 },
  { name: "footerImg", maxCount: 1 },
]);

router.post("/", uploadFields, createAppSettings);

router.get("/", getAllAppSettings);

router.get("/:id", getAppSettingsById);

router.put("/:id", uploadFields, updateAppSettings);

router.delete("/:id", deleteAppSettings);

export const appSettingsRouter = router;
