import express from "express";
import {
  addToCart,
  clearCart,
  deleteCart,
  getAllCartItems,
  getCartItemById,
  updateCart,
} from "./addToCart.controller";

const router = express.Router();

router.post("/", addToCart);
router.get("/", getAllCartItems);
router.delete("/clear", clearCart); // "/:id" se pehle rakhna zaruri hai
router.get("/:id", getCartItemById);
router.put("/:id", updateCart);
router.delete("/:id", deleteCart);

export const cartRouter = router;
