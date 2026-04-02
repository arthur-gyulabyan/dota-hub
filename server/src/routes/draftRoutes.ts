import { Router } from "express";
import {
  submitDraft,
  analyzeDraftController,
  getRecommendations,
} from "../controllers/draftController.js";

const router = Router();

router.post("/submit-draft", submitDraft);
router.post("/analyze-draft", analyzeDraftController);
router.get("/recommendations/:draftStateId", getRecommendations);

export default router;
