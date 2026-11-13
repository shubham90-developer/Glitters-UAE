import express from "express";
import {
  createStoreEnquiry,
  deleteStoreEnquiryById,
  getAllStoreEnquiry,
  StoreEnquiryById,
} from "./storeEnquiry.controller";

const router = express.Router();

router.post("/", createStoreEnquiry);

router.get("/", getAllStoreEnquiry);

router.get("/:id", StoreEnquiryById);

router.delete("/:id", deleteStoreEnquiryById);

export const storeEnquiryRouter = router;
