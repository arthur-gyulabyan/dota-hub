import { useState } from "react";
import { HeroSelector } from "../components/HeroSelector";
import { RecommendationList } from "../components/RecommendationList";
import { useDraftAnalysis } from "../hooks/useDraftAnalysis";

const stepLabels: Record<string, string> = {
  submitting: "Submitting draft...",
  analyzing: "Analyzing draft with AI — this may take a moment...",
};

export function HomePage() {
  const { step, recommendations, error, analyze, reset } = useDraftAnalysis();
  const [userTeam, setUserTeam] = useState<"radiant" | "dire">("radiant");
  const [alliedPicks, setAlliedPicks] = useState<string[]>([]);
  const [enemyPicks, setEnemyPicks] = useState<string[]>([]);

  const isProcessing = ["submitting", "analyzing"].includes(step);
  const canAnalyze = (alliedPicks.length > 0 || enemyPicks.length > 0) && !isProcessing;

  function handleAnalyze() {
    analyze(userTeam, alliedPicks, enemyPicks);
  }

  function handleReset() {
    reset();
    setAlliedPicks([]);
    setEnemyPicks([]);
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>
      <h1>Dota Hub — Best Pick</h1>
      <p>Select the heroes already picked in your draft to get AI-powered recommendations.</p>

      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>Your Team</label>
        <select
          value={userTeam}
          onChange={(e) => setUserTeam(e.target.value as "radiant" | "dire")}
          style={{ padding: "6px" }}
          disabled={isProcessing}
        >
          <option value="radiant">Radiant</option>
          <option value="dire">Dire</option>
        </select>
      </div>

      <HeroSelector
        label="Allied Heroes"
        picks={alliedPicks}
        onChange={setAlliedPicks}
        excludeHeroes={enemyPicks}
      />

      <HeroSelector
        label="Enemy Heroes"
        picks={enemyPicks}
        onChange={setEnemyPicks}
        excludeHeroes={alliedPicks}
      />

      <button
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        style={{
          padding: "10px 24px",
          fontSize: "16px",
          cursor: canAnalyze ? "pointer" : "not-allowed",
          opacity: canAnalyze ? 1 : 0.5,
        }}
      >
        Analyze Draft
      </button>

      {isProcessing && (
        <p style={{ marginTop: "16px" }}>{stepLabels[step]}</p>
      )}

      {error && (
        <div style={{ color: "#ff4444", marginTop: "16px" }}>
          <p>Error: {error}</p>
          <button onClick={handleReset}>Try Again</button>
        </div>
      )}

      {recommendations.length > 0 && <RecommendationList recommendations={recommendations} />}

      {step === "done" && (
        <button onClick={handleReset} style={{ marginTop: "16px" }}>
          Analyze Another Draft
        </button>
      )}
    </div>
  );
}
