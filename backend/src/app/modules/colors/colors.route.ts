import express from "express";
import {
  createColors,
  deleteColors,
  getAllColorsData,
  getColorsById,
  updateColors,
} from "./colors.controller";

const router = express.Router();

router.post("/", createColors);

router.get("/", getAllColorsData);
router.get("/:id", getColorsById);

router.put("/:id", updateColors);
router.delete("/:id", deleteColors);

export const colorsRouter = router;
