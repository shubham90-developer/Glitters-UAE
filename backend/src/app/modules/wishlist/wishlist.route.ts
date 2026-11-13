import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";

import {
  addToWishlist,
  clearWishlist,
  deleteWishlist,
  deleteWishlistByProduct,
  getAllWishlist,
  getWishlistById,
} from "./wishlist.controller";

const router = express.Router();

/* =========================================================
   Authentication
========================================================= */

router.use(authMiddleware);

/* =========================================================
   Wishlist Routes
========================================================= */

/* Add */
router.post("/", addToWishlist);

/* Get all */
router.get("/", getAllWishlist);

/* Clear all */
router.delete("/clear", clearWishlist);

/* Delete by PRODUCT ID */
router.delete("/product/:productId", deleteWishlistByProduct);

/* Get by WISHLIST ID */
router.get("/:id", getWishlistById);

/* Delete by WISHLIST ID */
router.delete("/:id", deleteWishlist);

export const wishlistRouter = router;
