import type { HeroRecommendation } from "../types/draft";
import { RecommendationCard } from "./RecommendationCard";

interface Props {
  recommendations: HeroRecommendation[];
}

export function RecommendationList({ recommendations }: Props) {
  if (recommendations.length === 0) return null;

  return (
    <div className="recommendation-list">
      <h3>Recommended Picks</h3>
      {recommendations.map((rec) => (
        <RecommendationCard key={rec.id} recommendation={rec} />
      ))}
    </div>
  );
}
