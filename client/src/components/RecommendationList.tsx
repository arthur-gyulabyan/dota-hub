import { useState } from "react";
import type { Hero } from "../types/hero";
import type { HeroRecommendation } from "../types/draft";
import { RecommendationCard } from "./RecommendationCard";
import "./RecommendationList.css";

type FilterValue = "all" | "midlane" | "offlane" | "carry" | "hard_support";

interface Props {
  heroes: Hero[];
  recommendations: HeroRecommendation[];
  status: "idle" | "submitting" | "analyzing" | "done" | "error";
  onOpenItems: (rec: HeroRecommendation) => void;
}

const FILTERS: { v: FilterValue; l: string }[] = [
  { v: "all", l: "All" },
  { v: "midlane", l: "Mid" },
  { v: "offlane", l: "Off" },
  { v: "carry", l: "Carry" },
  { v: "hard_support", l: "Sup" },
];

export const RecommendationList = ({ heroes, recommendations, status, onOpenItems }: Props) => {
  const [filter, setFilter] = useState<FilterValue>("all");
  const filtered = filter === "all"
    ? recommendations
    : recommendations.filter((r) => r.role === filter);
  const showFilter = recommendations.length > 0;

  return (
    <aside className="rec-panel">
      <div className="rec-header">
        <div className="rec-header-title">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          AI Recommendations
          {recommendations.length > 0 && (
            <span className="rec-count">{filtered.length}/{recommendations.length}</span>
          )}
        </div>
        {showFilter && (
          <div className="rec-filter">
            {FILTERS.map((f) => (
              <button
                key={f.v}
                className={`rec-filter-btn ${filter === f.v ? "active" : ""}`}
                onClick={() => setFilter(f.v)}
              >
                {f.l}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rec-list">
        {(status === "idle" || status === "error") && recommendations.length === 0 && (
          <div className="rec-empty">
            <div className="rec-empty-icon">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            Lock in at least one pick on either team, then hit{" "}
            <span className="kbd">Analyze</span> to surface the best responses.
          </div>
        )}

        {(status === "submitting" || status === "analyzing") && (
          <div className="rec-empty">
            <div className="analyzing-dots"><span /><span /><span /></div>
            <div className="analyzing-text">Claude is reasoning…</div>
          </div>
        )}

        {filtered.map((rec, i) => (
          <RecommendationCard
            key={rec.id}
            heroes={heroes}
            recommendation={rec}
            index={i}
            onOpenItems={() => onOpenItems(rec)}
          />
        ))}
      </div>
    </aside>
  );
};
