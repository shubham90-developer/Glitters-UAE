import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";

import { createOrder, getMyOrders, getOrderById } from "./order.controller";

const router = express.Router();

// every order route needs a logged-in user
router.use(authMiddleware);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/:id", getOrderById);

export const orderRouter = router;
