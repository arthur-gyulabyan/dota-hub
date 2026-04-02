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

export interface ItemBuildRequest {
  heroName: string;
  role: string;
  alliedPicks: string[];
  enemyPicks: string[];
  bans: string[];
  userTeam: "radiant" | "dire";
  popularItems: {
    start_game_items: string[];
    early_game_items: string[];
    mid_game_items: string[];
    late_game_items: string[];
  };
}
