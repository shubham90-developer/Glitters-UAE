import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createClients,
  deleteClients,
  getAllClients,
  getClientById,
  updateClients,
} from "./clients.controller";

const router = express.Router();

// create
router.post("/", upload.single("logo"), createClients);

// get
router.get("/", getAllClients);

// get signle
router.get("/:id", getClientById);

// update
router.put("/:id", upload.single("logo"), updateClients);

// delete
router.delete("/:id", deleteClients);

export const clientsRouter = router;
