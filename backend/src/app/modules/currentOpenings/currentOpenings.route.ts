import express from "express";
import {
  createCurrentOpenings,
  deleteCurrentOpenings,
  getAllCurrentOpeningsData,
  getCurrentOpeningsById,
  getCurrentOpeningsByTitle,
  updateCurrentOpenings,
} from "./currentOpenings.controller";

const router = express.Router();

router.post("/", createCurrentOpenings);

router.get("/", getAllCurrentOpeningsData);

router.get("/:id", getCurrentOpeningsById);

router.get("/:title", getCurrentOpeningsByTitle);

router.put("/:id", updateCurrentOpenings);

router.delete("/:id", deleteCurrentOpenings);

export const currentOpeningsRouter = router;
