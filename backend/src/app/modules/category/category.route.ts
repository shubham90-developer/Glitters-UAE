import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getClientById,
  updateCategory,
} from "./category.controller";

const router = express.Router();

// create
router.post("/", upload.single("img"), createCategory);

// get
router.get("/", getAllCategory);

// get signle
router.get("/:id", getClientById);

// update
router.put("/:id", upload.single("img"), updateCategory);

// delete
router.delete("/:id", deleteCategory);

export const categoryRouter = router;
