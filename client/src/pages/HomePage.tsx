import { useState } from "react";
import { DraftBoard } from "../components/DraftBoard";
import { RecommendationList } from "../components/RecommendationList";
import { useDraftAnalysis } from "../hooks/useDraftAnalysis";
import { useHeroes } from "../hooks/useHeroes";
import "./HomePage.css";

export const HomePage = () => {
  const { heroes, loading: heroesLoading, error: heroesError } = useHeroes();
  const { step, recommendations, error, analyze, reset } = useDraftAnalysis();
  const [userTeam, setUserTeam] = useState<"radiant" | "dire">("radiant");
  const [radiantPicks, setRadiantPicks] = useState<string[]>([]);
  const [direPicks, setDirePicks] = useState<string[]>([]);

  const alliedPicks = userTeam === "radiant" ? radiantPicks : direPicks;
  const enemyPicks = userTeam === "radiant" ? direPicks : radiantPicks;

  const isProcessing = ["submitting", "analyzing"].includes(step);
  const canAnalyze = (radiantPicks.length > 0 || direPicks.length > 0) && !isProcessing;

  const handleAnalyze = () => {
    analyze(userTeam, alliedPicks, enemyPicks);
  };

  const handleReset = () => {
    reset();
    setRadiantPicks([]);
    setDirePicks([]);
  };

  if (heroesLoading) {
    return (
      <div className="page-loading">
        <div className="loading-spinner" />
        <span>Loading heroes...</span>
      </div>
    );
  }

  if (heroesError) {
    return (
      <div className="page-loading">
        <span style={{ color: "var(--dire)" }}>Failed to load heroes: {heroesError}</span>
      </div>
    );
  }

  return (
    <div className="page">
      
      <header className="page-header">
        <div className="page-logo">
          <span className="logo-dota">DOTA</span>
          <span className="logo-hub">HUB</span>
        </div>
        <p className="page-subtitle">AI-Powered Draft Analysis</p>
      </header>


      <div className="team-selector">
        <span className="team-selector-label">Your team</span>
        <div className="team-toggle">
          <button
            className={`team-toggle-btn radiant ${userTeam === "radiant" ? "active" : ""}`}
            onClick={() => setUserTeam("radiant")}
            disabled={isProcessing}
          >
            Radiant
          </button>
          <button
            className={`team-toggle-btn dire ${userTeam === "dire" ? "active" : ""}`}
            onClick={() => setUserTeam("dire")}
            disabled={isProcessing}
          >
            Dire
          </button>
        </div>
      </div>


      <DraftBoard
        heroes={heroes}
        userTeam={userTeam}
        radiantPicks={radiantPicks}
        direPicks={direPicks}
        onRadiantChange={setRadiantPicks}
        onDireChange={setDirePicks}
        disabled={isProcessing}
      />


      <div className="action-area">
        {step === "done" ? (
          <button className="btn btn-secondary" onClick={handleReset}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            New Analysis
          </button>
        ) : (
          <button
            className={`btn btn-primary ${isProcessing ? "loading" : ""}`}
            onClick={handleAnalyze}
            disabled={!canAnalyze}
          >
            {isProcessing ? (
              <>
                <div className="btn-spinner" />
                {step === "submitting" ? "Submitting..." : "Analyzing with AI..."}
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
                Analyze Draft
              </>
            )}
          </button>
        )}
      </div>


      {error && (
        <div className="error-banner">
          <span>{error}</span>
          <button onClick={handleReset}>Retry</button>
        </div>
      )}


      {recommendations.length > 0 && (
        <RecommendationList recommendations={recommendations} />
      )}
    </div>
  );
};
