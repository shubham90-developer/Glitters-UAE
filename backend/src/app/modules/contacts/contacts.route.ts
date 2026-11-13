import express from "express";
import {
  createContact,
  deleteContact,
  getAllContactData,
  getContactById,
  updateContact,
} from "./contacts.controller";

const router = express.Router();

router.post("/", createContact);

router.get("/", getAllContactData);
router.get("/:id", getContactById);

router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export const contactRouter = router;
