import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware";
import {
  addSavedCard,
  deleteSavedCard,
  getSavedCards,
  setDefaultCard,
} from "./Savedcards.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSavedCards);
router.post("/", addSavedCard);
router.patch("/:id/default", setDefaultCard);
router.delete("/:id", deleteSavedCard);

export const savedCardsRouter = router;
