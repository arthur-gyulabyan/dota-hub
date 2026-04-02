import type { HeroRecommendation } from "../types/draft";

interface Props {
  recommendation: HeroRecommendation;
}

export function RecommendationCard({ recommendation }: Props) {
  return (
    <div
      className="recommendation-card"
      style={{
        border: "1px solid #333",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h4 style={{ margin: 0 }}>{recommendation.heroName}</h4>
        <span style={{ fontSize: "14px", color: "#888" }}>
          {recommendation.confidence}% confidence
        </span>
      </div>
      <p style={{ fontSize: "14px", color: "#aaa", margin: "4px 0" }}>
        Role: {recommendation.role}
      </p>
      <p style={{ margin: "8px 0 0" }}>{recommendation.reasoning}</p>
    </div>
  );
}
