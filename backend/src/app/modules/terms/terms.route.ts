import express from "express";
import {
  createTerms,
  getAllTerms,
  getTermsById,
  updateTerms,
} from "./terms.controller";

const router = express.Router();

router.post("/", createTerms);

router.get("/", getAllTerms);

router.get("/:id", getTermsById);

router.put("/:id", updateTerms);

export const termsRouter = router;
