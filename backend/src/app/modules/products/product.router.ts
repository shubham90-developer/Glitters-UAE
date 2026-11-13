import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsById,
  updateProduct,
} from "./product.controller";

import { upload } from "../../config/cloudinary";

const router = express.Router();

// ============================================
// PRODUCT UPLOAD FIELDS
// variantImages: many files per variant, mapped by `variantImageIndexes`
// ============================================

const uploadFields = upload.fields([
  { name: "productImages", maxCount: 10 },
  { name: "variantImages", maxCount: 200 },
]);

router.post("/", uploadFields, createProduct);

router.get("/", getAllProducts);

router.get("/:id", getAllProductsById);

router.put("/:id", uploadFields, updateProduct);

router.delete("/:id", deleteProduct);

export const productRouter = router;