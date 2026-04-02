export interface DraftState {
  id: string;
  userTeam: "radiant" | "dire";
  alliedPicks: string[];
  enemyPicks: string[];
  bans: string[];
}

export interface HeroRecommendation {
  id: string;
  draftStateId: string;
  heroName: string;
  reasoning: string;
  confidence: number;
  role: string;
}

export interface ItemSuggestion {
  phase: "starting" | "early" | "core" | "luxury";
  items: string[];
  reasoning: string;
}
