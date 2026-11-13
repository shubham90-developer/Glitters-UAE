import express from "express";
import {
  createCoupons,
  deleteCoupons,
  getAllCouponsData,
  getCouponsById,
  updateCoupons,
} from "./coupons.controller";

const router = express.Router();

router.post("/", createCoupons);

router.get("/", getAllCouponsData);
router.get("/:id", getCouponsById);

router.put("/:id", updateCoupons);
router.delete("/:id", deleteCoupons);

export const couponsRouter = router;
