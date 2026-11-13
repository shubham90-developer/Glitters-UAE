import express from "express";

import { authMiddleware } from "../../middlewares/authMiddleware";

import { syncUser, getMe, updateEmail } from "./auth.controller";

const router = express.Router();

router.post("/sync", authMiddleware, syncUser);

router.get("/me", authMiddleware, getMe);

router.put("/email", authMiddleware, updateEmail);

export const authRouter = router;
