import express from "express";
import { upload } from "../../config/cloudinary";
import {
  createCertificates,
  deleteCertificates,
  getAllCertificates,
  getCertificatesById,
  updateCertificates,
} from "./certificates.controller";

const router = express.Router();

// create
router.post("/", upload.single("certificatesImage"), createCertificates);

// get
router.get("/", getAllCertificates);

// get signle
router.get("/:id", getCertificatesById);

// update
router.put("/:id", upload.single("certificatesImage"), updateCertificates);

// delete
router.delete("/:id", deleteCertificates);

export const certificatesRouter = router;
