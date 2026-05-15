import { useState } from "react";
import type { HeroRecommendation } from "../types/draft";
import type { Role } from "../types/hero";
import { TopBar } from "../components/TopBar";
import { SeatBar } from "../components/SeatBar";
import { DraftBoard } from "../components/DraftBoard";
import { BansList } from "../components/BansList";
import { RecommendationList } from "../components/RecommendationList";
import { HeroPicker, type PickerTarget } from "../components/HeroPicker";
import { ItemBuild } from "../components/ItemBuild";
import { useDraftAnalysis } from "../hooks/useDraftAnalysis";
import { useHeroes } from "../hooks/useHeroes";
import { useItems } from "../hooks/useItems";
import "./HomePage.css";

type Side = "radiant" | "dire";

const EMPTY_TEAM: (string | null)[] = [null, null, null, null, null];

const findNextSlot = (radiant: (string | null)[], dire: (string | null)[]) => {
  const radIdx = radiant.findIndex((x) => !x);
  const dirIdx = dire.findIndex((x) => !x);
  if (radIdx === -1 && dirIdx === -1) {
    return null;
  }
  if (radIdx === -1) {
    return { side: "dire" as Side, index: dirIdx };
  }
  if (dirIdx === -1) {
    return { side: "radiant" as Side, index: radIdx };
  }
  const rCount = radiant.filter(Boolean).length;
  const dCount = dire.filter(Boolean).length;

  return rCount <= dCount
    ? { side: "radiant" as Side, index: radIdx }
    : { side: "dire" as Side, index: dirIdx };
};

const PHASE_STEPS_LEN = 10;

export const HomePage = () => {
  const { heroes, loading: heroesLoading, error: heroesError } = useHeroes();
  const { items, loading: itemsLoading } = useItems();
  const { step, recommendations, error, analyze, reset } = useDraftAnalysis();

  const [userTeam, setUserTeam] = useState<Side>("radiant");
  const [myRole, setMyRole] = useState<Role | null>(null);
  const [radiant, setRadiant] = useState<(string | null)[]>(EMPTY_TEAM);
  const [dire, setDire] = useState<(string | null)[]>(EMPTY_TEAM);
  const [bans, setBans] = useState<string[]>([]);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget | null>(null);
  const [itemRec, setItemRec] = useState<HeroRecommendation | null>(null);

  const radiantPicks = radiant.filter((x): x is string => !!x);
  const direPicks = dire.filter((x): x is string => !!x);
  const allSelected = [...radiantPicks, ...direPicks, ...bans];
  const isProcessing = step === "submitting" || step === "analyzing";
  const totalPicks = radiantPicks.length + direPicks.length;
  const phaseIdx = Math.min(PHASE_STEPS_LEN - 1, bans.length + totalPicks);
  const nextSlot = findNextSlot(radiant, dire);
  const canAnalyze = totalPicks > 0 && !isProcessing;

  const alliedPicks = userTeam === "radiant" ? radiantPicks : direPicks;
  const enemyPicks = userTeam === "radiant" ? direPicks : radiantPicks;

  const handlePickerSelect = (name: string) => {
    if (!pickerTarget) {
      return;
    }
    if (pickerTarget.side === "ban") {
      setBans((b) => [...b, name]);
    } else if (pickerTarget.side === "radiant") {
      setRadiant((r) => r.map((v, i) => (i === pickerTarget.index ? name : v)));
    } else {
      setDire((d) => d.map((v, i) => (i === pickerTarget.index ? name : v)));
    }
    setPickerTarget(null);
  };

  const handleRemove = (side: Side, idx: number) => {
    if (side === "radiant") {
      setRadiant((r) => r.map((v, i) => (i === idx ? null : v)));
    } else {
      setDire((d) => d.map((v, i) => (i === idx ? null : v)));
    }
  };

  const handleReset = () => {
    reset();
    setRadiant(EMPTY_TEAM);
    setDire(EMPTY_TEAM);
    setBans([]);
  };

  const handleAnalyze = () => {
    analyze(userTeam, alliedPicks, enemyPicks, bans);
  };

  if (heroesLoading || itemsLoading) {
    return (
      <div className="page-loading">
        <div className="page-loading-spinner" />
        <span>Loading heroes…</span>
      </div>
    );
  }

  if (heroesError) {
    return (
      <div className="page-loading">
        <span style={{ color: "var(--dire-bright)" }}>Failed to load heroes: {heroesError}</span>
      </div>
    );
  }

  return (
    <div className="app">
      <TopBar phaseIdx={phaseIdx} onReset={handleReset} />

      <div className="main">
        <section className="workspace">
          <SeatBar
            userTeam={userTeam}
            onUserTeamChange={setUserTeam}
            myRole={myRole}
            onMyRoleChange={setMyRole}
            disabled={isProcessing}
          />

          <div className="workspace-section">
            <DraftBoard
              heroes={heroes}
              userTeam={userTeam}
              radiant={radiant}
              dire={dire}
              nextSlot={nextSlot}
              onPickSlot={(side, index) => setPickerTarget({ side, index })}
              onRemove={handleRemove}
              disabled={isProcessing}
            />
          </div>

          <BansList
            heroes={heroes}
            bans={bans}
            onAdd={() => setPickerTarget({ side: "ban" })}
            onRemove={(name) => setBans((b) => b.filter((x) => x !== name))}
            disabled={isProcessing}
          />

          <div className="action-bar">
            <div className="action-summary">
              <span><strong>{totalPicks}</strong>/10 heroes picked</span>
              <span><strong>{bans.length}</strong> banned</span>
              <span>
                Your team:{" "}
                <strong style={{ color: userTeam === "radiant" ? "var(--radiant-bright)" : "var(--dire-bright)" }}>
                  {userTeam}
                </strong>
              </span>
            </div>
            <span className="action-spacer" />
            {recommendations.length > 0 && (
              <button className="btn ghost" onClick={handleReset}>New Analysis</button>
            )}
            <button
              className="btn primary"
              onClick={handleAnalyze}
              disabled={!canAnalyze}
            >
              {isProcessing ? (
                <>
                  <span className="btn-spinner" />
                  {step === "submitting" ? "Submitting…" : "Analyzing…"}
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                  {recommendations.length > 0 ? "Re-analyze" : "Analyze Draft"}
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={handleReset}>Reset</button>
            </div>
          )}
        </section>

        <RecommendationList
          heroes={heroes}
          recommendations={recommendations}
          status={step}
          onOpenItems={setItemRec}
        />
      </div>

      {pickerTarget && (
        <HeroPicker
          heroes={heroes}
          excludeNames={allSelected}
          bannedNames={bans}
          target={pickerTarget}
          onSelect={handlePickerSelect}
          onClose={() => setPickerTarget(null)}
        />
      )}

      {itemRec && (
        <ItemBuild
          recommendation={itemRec}
          heroes={heroes}
          items={items}
          alliedPicks={alliedPicks}
          enemyPicks={enemyPicks}
          bans={bans}
          userTeam={userTeam}
          onClose={() => setItemRec(null)}
        />
      )}
    </div>
  );
};
