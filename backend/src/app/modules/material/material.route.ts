import express from "express";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterialData,
  getMaterialById,
  updateMaterial,
} from "./material.controller";

const router = express.Router();

router.post("/", createMaterial);

router.get("/", getAllMaterialData);
router.get("/:id", getMaterialById);

router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

export const materialRouter = router;
