import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createSubCategory,
  deleteSubCategory,
  getAllSubCategory,
  getSubCategoryById,
  updateSubCategory,
} from "./subCategory.controller";

const router = express.Router();

// create
router.post("/", upload.single("img"), createSubCategory);

// get
router.get("/", getAllSubCategory);

// get signle
router.get("/:id", getSubCategoryById);

// update
router.put("/:id", upload.single("img"), updateSubCategory);

// delete
router.delete("/:id", deleteSubCategory);

export const subCategoryRouter = router;
