import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";

import {
  createAddress,
  deleteAddress,
  getMyAddresses,
  updateAddress,
} from "./Address.controller";

const router = express.Router();

// every address route needs a logged-in user
router.use(authMiddleware);

router.get("/", getMyAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export const addressRouter = router;
