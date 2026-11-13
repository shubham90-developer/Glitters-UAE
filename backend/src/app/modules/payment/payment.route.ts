import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";

import {
  cancelPayment,
  createRazorpayPayment,
  createTabbyPayment,
  verifyRazorpayPayment,
  verifyTabbyPayment,
} from "./payment.controller";

const router = express.Router();

// every payment route needs a logged-in user
router.use(authMiddleware);

router.post("/razorpay/create", createRazorpayPayment);
router.post("/razorpay/verify", verifyRazorpayPayment);

router.post("/tabby/create", createTabbyPayment);
router.post("/tabby/verify", verifyTabbyPayment);

router.post("/cancel", cancelPayment);

export const paymentRouter = router;
