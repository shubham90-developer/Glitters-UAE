import express from "express";

import {
  createSeoPages,
  deleteSeoPages,
  getAllSeoPages,
  getByIdSeoPages,
  updateSeoPages,
} from "./seoPages.controller";

import { upload } from "../../config/cloudinary";

const router = express.Router();

// =====================================================
// MULTIPLE IMAGE UPLOAD
// =====================================================

const uploadFields = upload.fields([
  {
    name: "productListBgImages",
    maxCount: 10,
  },

  {
    name: "wishListBgImages",
    maxCount: 10,
  },
]);

// =====================================================
// CREATE
// =====================================================

router.post("/", uploadFields, createSeoPages);

// =====================================================
// GET ALL
// =====================================================

router.get("/", getAllSeoPages);

// =====================================================
// GET BY ID
// =====================================================

router.get("/:id", getByIdSeoPages);

// =====================================================
// UPDATE
// =====================================================

router.put("/:id", uploadFields, updateSeoPages);

// =====================================================
// DELETE
// =====================================================

router.delete("/:id", deleteSeoPages);

export const seoPagesRouter = router;
