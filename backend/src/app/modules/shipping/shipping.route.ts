import express from "express";

import { adminAuth } from "../../middlewares/adminAuth";
import { authMiddleware } from "../../middlewares/authMiddleware";

import {
  createShipmentAdmin,
  getOrderTracking,
  shiprocketWebhook,
} from "./shipping.controller";

const router = express.Router();

// public: protected by the x-api-key token instead of a login
router.post("/webhook", shiprocketWebhook);

// customer (Firebase login): track my own order
router.get("/track/:orderId", authMiddleware, getOrderTracking);

// admin (admin JWT): create / retry a shipment
router.post("/admin/orders/:orderId/create", adminAuth, createShipmentAdmin);

export const shippingRouter = router;
