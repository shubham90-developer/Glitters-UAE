import express from "express";
import {
  createCareerInfo,
  deleteCareerInfo,
  getAllCareerInfoData,
  getCareerInfoById,
  updateCareerInfo,
} from "./careerInfo.controller";

const router = express.Router();

router.post("/", createCareerInfo);

router.get("/", getAllCareerInfoData);

router.get("/:id", getCareerInfoById);

router.put("/:id", updateCareerInfo);

router.delete("/:id", deleteCareerInfo);

export const careerInfoRouter = router;
