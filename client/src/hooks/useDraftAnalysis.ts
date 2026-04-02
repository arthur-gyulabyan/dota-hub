import { useState } from "react";
import type { DraftState, HeroRecommendation } from "../types/draft";
import { submitDraft, analyzeDraft } from "../api/draftApi";

type AnalysisStep = "idle" | "submitting" | "analyzing" | "done" | "error";

interface DraftAnalysisState {
  step: AnalysisStep;
  draftState: DraftState | null;
  recommendations: HeroRecommendation[];
  error: string | null;
}

export function useDraftAnalysis() {
  const [state, setState] = useState<DraftAnalysisState>({
    step: "idle",
    draftState: null,
    recommendations: [],
    error: null,
  });

  async function analyze(userTeam: "radiant" | "dire", alliedPicks: string[], enemyPicks: string[]) {
    try {
      setState((s) => ({ ...s, step: "submitting", error: null }));
      const draftState = await submitDraft(userTeam, alliedPicks, enemyPicks);

      setState((s) => ({ ...s, step: "analyzing", draftState }));
      const recommendations = await analyzeDraft(draftState.id);

      setState((s) => ({ ...s, step: "done", recommendations }));
    } catch (err) {
      setState((s) => ({
        ...s,
        step: "error",
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }

  function reset() {
    setState({
      step: "idle",
      draftState: null,
      recommendations: [],
      error: null,
    });
  }

  return { ...state, analyze, reset };
}
