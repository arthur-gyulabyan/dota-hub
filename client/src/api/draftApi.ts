import type { DraftState, HeroRecommendation, ItemSuggestion } from "../types/draft";
import type { ItemsMap } from "../types/item";
import { apiPost, apiGet } from "./client";
import { STEAM_CDN } from "../types/hero";

export const submitDraft = (
  userTeam: "radiant" | "dire",
  alliedPicks: string[],
  enemyPicks: string[],
  bans: string[]
): Promise<DraftState> => {

  return apiPost<DraftState>("/submit-draft", { userTeam, alliedPicks, enemyPicks, bans });
};

export const analyzeDraft = (draftStateId: string): Promise<HeroRecommendation[]> => {

  return apiPost<HeroRecommendation[]>("/analyze-draft", { draftStateId });
};

export const getRecommendations = (draftStateId: string): Promise<HeroRecommendation[]> => {

  return apiGet<HeroRecommendation[]>(`/recommendations/${draftStateId}`);
};

export const fetchItemPopularity = async (heroId: number, itemsMap: ItemsMap, signal?: AbortSignal): Promise<Record<string, string[]>> => {
  const res = await fetch(`https://api.opendota.com/api/heroes/${heroId}/itemPopularity`, { signal });
  if (!res.ok) {
    return { start_game_items: [], early_game_items: [], mid_game_items: [], late_game_items: [] };
  }

  const data: Record<string, Record<string, number>> = await res.json();
  const resolve = (phase: Record<string, number> | undefined): string[] => {
    if (!phase) {
      return [];
    }

    return Object.entries(phase)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([id]) => {
        const item = Object.values(itemsMap).find((i) => i.id === Number(id));

        return item?.dname || `item_${id}`;
      });
  };

  return {
    start_game_items: resolve(data.start_game_items),
    early_game_items: resolve(data.early_game_items),
    mid_game_items: resolve(data.mid_game_items),
    late_game_items: resolve(data.late_game_items),
  };
};

export const suggestItems = (body: {
  heroName: string;
  role: string;
  alliedPicks: string[];
  enemyPicks: string[];
  bans: string[];
  userTeam: "radiant" | "dire";
  popularItems: Record<string, string[]>;
}, signal?: AbortSignal): Promise<ItemSuggestion[]> => {

  return apiPost<ItemSuggestion[]>("/suggest-items", body, signal);
};

export const getItemImageUrl = (itemsMap: ItemsMap, itemName: string): string | null => {
  const item = Object.values(itemsMap).find(
    (i) => i.dname?.toLowerCase() === itemName.toLowerCase()
  );
  if (!item) {
    return null;
  }

  return `${STEAM_CDN}${item.img}`;
};
