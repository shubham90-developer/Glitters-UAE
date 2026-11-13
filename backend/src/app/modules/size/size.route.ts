import express from "express";
import {
  createSize,
  deleteSize,
  getAllSizeData,
  getSizeById,
  updateSize,
} from "./size.controller";

const router = express.Router();

router.post("/", createSize);

router.get("/", getAllSizeData);
router.get("/:id", getSizeById);

router.put("/:id", updateSize);
router.delete("/:id", deleteSize);

export const sizeRouter = router;
