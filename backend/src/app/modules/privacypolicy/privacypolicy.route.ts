import express from "express";
import {
  createPrivacyPolicy,
  getAllPrivacyPolicy,
  getPrivacyPolicyById,
  updatePrivacyPolicy,
} from "./privacypolicy.controller";

const router = express.Router();

router.post("/", createPrivacyPolicy);

router.get("/", getAllPrivacyPolicy);

router.get("/:id", getPrivacyPolicyById);

router.put("/:id", updatePrivacyPolicy);

export const privacyPolicyRouter = router;
