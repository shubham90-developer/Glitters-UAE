import express from "express";
import { adminAuth } from "../../middlewares/adminAuth";
import { getDashboardStats } from "./dashboard.controller";

const router = express.Router();

router.get("/stats", adminAuth, getDashboardStats);

export const dashboardRouter = router;
