import express from "express";
import {
  createBrands,
  deleteBrands,
  getAllBrandsData,
  getBrandsById,
  updateBrands,
} from "./brands.controller";

const router = express.Router();

router.post("/", createBrands);

router.get("/", getAllBrandsData);
router.get("/:id", getBrandsById);

router.put("/:id", updateBrands);
router.delete("/:id", deleteBrands);

export const brandsRouter = router;
