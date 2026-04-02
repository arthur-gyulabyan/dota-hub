import { Router } from "express";
import {
  submitDraft,
  analyzeDraftController,
  getRecommendations,
  suggestItemsController,
} from "../controllers/draftController.js";

const router = Router();

router.post("/submit-draft", submitDraft);
router.post("/analyze-draft", analyzeDraftController);
router.get("/recommendations/:draftStateId", getRecommendations);
router.post("/suggest-items", suggestItemsController);

export default router;
