import express from "express";

import { upload } from "../../config/cloudinary";
import {
  awardsById,
  createAwards,
  deleteAwards,
  getAllAwards,
  updateAwards,
} from "./awards.controller";

const router = express.Router();

// create
router.post("/", upload.single("image"), createAwards);

// get all
router.get("/", getAllAwards);

// single get
router.get("/:id", awardsById);

// update
router.put("/:id", upload.single("image"), updateAwards);

// delete
router.delete("/:id", deleteAwards);

export const awardsRouter = router;
