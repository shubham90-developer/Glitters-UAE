import express from "express";

import {
  createStoreLocation,
  deleteStoreLocationById,
  getAllStoreLocation,
  StoreLocationById,
  updateStoreLocationById,
} from "./storeLocation.controller";

import { upload } from "../../config/cloudinary";

const router = express.Router();

const storeLocationUpload = upload.fields([
  {
    name: "img",
    maxCount: 1,
  },
  {
    name: "qrcode",
    maxCount: 1,
  },
]);

router.post("/", storeLocationUpload, createStoreLocation);

router.get("/", getAllStoreLocation);

router.get("/:id", StoreLocationById);

router.put("/:id", storeLocationUpload, updateStoreLocationById);

router.delete("/:id", deleteStoreLocationById);

export const storeLocationRouter = router;
