import express from "express";

import {
  createReturnRequest,
  deleteReturnRequest,
  getAllCareerEnquiryData,
  getReturnRequestById,
  updateReturnRequest,
} from "./returnRequest.controller";

const router = express.Router();

router.post("/", createReturnRequest);

router.get("/", getAllCareerEnquiryData);

router.get("/:id", getReturnRequestById);

router.put("/:id", updateReturnRequest);

router.delete("/:id", deleteReturnRequest);

export const returnRequestRouter = router;
