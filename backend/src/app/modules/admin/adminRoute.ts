import express from "express";
import { adminAuth } from "../../middlewares/adminAuth";
import {
  adminLogin,
  adminSignup,
  getAdminProfile,
  changeAdminCredentials,
} from "./adminController";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/signin", adminLogin);
router.get("/me", adminAuth, getAdminProfile);

router.put("/change-credentials", adminAuth, changeAdminCredentials);

export const adminAuthRouter = router;
