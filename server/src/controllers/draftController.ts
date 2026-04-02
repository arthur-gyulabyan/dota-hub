import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { draftStates, recommendations } from "../store/inMemoryStore.js";
import { analyzeDraft } from "../services/draftAnalysisService.js";
import { DraftState } from "../models/types.js";

export function submitDraft(req: Request, res: Response) {
  const { userTeam, alliedPicks, enemyPicks } = req.body;

  if (!userTeam || !["radiant", "dire"].includes(userTeam)) {
    res.status(400).json({ message: "userTeam must be 'radiant' or 'dire'" });
    return;
  }

  if (!Array.isArray(alliedPicks) || !Array.isArray(enemyPicks)) {
    res.status(400).json({ message: "alliedPicks and enemyPicks must be arrays" });
    return;
  }

  if (alliedPicks.length === 0 && enemyPicks.length === 0) {
    res.status(400).json({ message: "At least one hero must be selected" });
    return;
  }

  const draftState: DraftState = {
    id: uuidv4(),
    userTeam,
    alliedPicks,
    enemyPicks,
  };

  draftStates.set(draftState.id, draftState);
  res.status(201).json(draftState);
}

export async function analyzeDraftController(req: Request, res: Response, next: NextFunction) {
  try {
    const { draftStateId } = req.body;

    if (!draftStateId) {
      res.status(400).json({ message: "draftStateId is required" });
      return;
    }

    const draftState = draftStates.get(draftStateId);
    if (!draftState) {
      res.status(404).json({ message: "Draft state not found" });
      return;
    }

    const recs = await analyzeDraft(draftState);
    recommendations.set(draftStateId, recs);

    res.status(201).json(recs);
  } catch (err) {
    next(err);
  }
}

export function getRecommendations(req: Request, res: Response) {
  const draftStateId = req.params.draftStateId as string;
  const recs = recommendations.get(draftStateId);

  if (!recs) {
    res.status(404).json({ message: "No recommendations found for this draft" });
    return;
  }

  res.json(recs);
}
