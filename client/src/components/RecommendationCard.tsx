import type { HeroRecommendation } from "../types/draft";
import "./RecommendationCard.css";

interface Props {
  recommendation: HeroRecommendation;
  index: number;
}

const roleColors: Record<string, string> = {
  carry: "#fbbf24",
  midlane: "#60a5fa",
  offlane: "#f87171",
  soft_support: "#4ade80",
  hard_support: "#a78bfa",
};

export const RecommendationCard = ({ recommendation, index }: Props) => {
  const color = roleColors[recommendation.role] || "#94a3b8";

  return (
    <div
      className="rec-card"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="rec-card-rank">#{index + 1}</div>

      <div className="rec-card-content">
        <div className="rec-card-header">
          <h4 className="rec-card-hero">{recommendation.heroName}</h4>
          <span className="rec-card-role" style={{ color, borderColor: color + "40" }}>
            {recommendation.role.replace("_", " ")}
          </span>
        </div>

        <p className="rec-card-reasoning">{recommendation.reasoning}</p>

        <div className="rec-card-confidence">
          <div className="rec-card-confidence-header">
            <span>Confidence</span>
            <span className="rec-card-confidence-value">{recommendation.confidence}%</span>
          </div>
          <div className="rec-card-confidence-track">
            <div
              className="rec-card-confidence-fill"
              style={{
                width: `${recommendation.confidence}%`,
                background: recommendation.confidence >= 80 ? "var(--radiant)" :
                  recommendation.confidence >= 60 ? "var(--gold)" : "var(--dire)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
