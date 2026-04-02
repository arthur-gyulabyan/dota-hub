import type { DraftState, HeroRecommendation } from "../types/draft";
import { apiPost, apiGet } from "./client";

export function submitDraft(
  userTeam: "radiant" | "dire",
  alliedPicks: string[],
  enemyPicks: string[]
): Promise<DraftState> {
  return apiPost<DraftState>("/submit-draft", { userTeam, alliedPicks, enemyPicks });
}

export function analyzeDraft(draftStateId: string): Promise<HeroRecommendation[]> {
  return apiPost<HeroRecommendation[]>("/analyze-draft", { draftStateId });
}

export function getRecommendations(draftStateId: string): Promise<HeroRecommendation[]> {
  return apiGet<HeroRecommendation[]>(`/recommendations/${draftStateId}`);
}
