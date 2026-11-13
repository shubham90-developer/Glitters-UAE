import express from "express";
import {
  createCounter,
  getAllCounterData,
  updateCounter,
} from "./counter.controller";

const router = express.Router();

router.post("/", createCounter);

router.get("/", getAllCounterData);

router.put("/:id", updateCounter);

export const counterRouter = router;
