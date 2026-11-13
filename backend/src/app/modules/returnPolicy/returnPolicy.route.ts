import express from "express";
import {
  createReturnPolicy,
  getAllReturnPolicy,
  getReturnPolicyById,
  updateReturnPolicy,
} from "./returnPolicy.controller";

const router = express.Router();

router.post("/", createReturnPolicy);

router.get("/", getAllReturnPolicy);

router.get("/:id", getReturnPolicyById);

router.put("/:id", updateReturnPolicy);

export const returnPolicyRouter = router;
