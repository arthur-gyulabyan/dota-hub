import type { Hero } from "../types/hero";
import { getHeroImageUrl, ROLE_COLORS, ROLE_LABELS, type Role } from "../types/hero";
import type { HeroRecommendation } from "../types/draft";
import "./RecommendationCard.css";

interface Props {
  heroes: Hero[];
  recommendation: HeroRecommendation;
  index: number;
  onOpenItems: () => void;
}

export const RecommendationCard = ({ heroes, recommendation, index, onOpenItems }: Props) => {
  const hero = heroes.find((h) => h.localized_name === recommendation.heroName);
  const role = recommendation.role as Role;
  const roleColor = ROLE_COLORS[role] || "var(--text-tertiary)";
  const roleLabel = ROLE_LABELS[role] || recommendation.role.replace("_", " ");
  const confColor =
    recommendation.confidence >= 80 ? "var(--radiant-bright)" :
    recommendation.confidence >= 65 ? "var(--gold)" : "var(--dire-bright)";

  return (
    <div className="rec-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="rec-top">
        <div className="rec-portrait">
          {hero && <img src={getHeroImageUrl(hero.img)} alt={hero.localized_name} />}
        </div>
        <div className="rec-name-col">
          <div className="rec-name">{recommendation.heroName}</div>
          <span className="rec-role" style={{ color: roleColor }}>{roleLabel}</span>
        </div>
      </div>

      <p className="rec-reasoning">{recommendation.reasoning}</p>

      <div className="rec-footer">
        <div className="rec-conf">
          <div className="rec-conf-row">
            <span className="rec-conf-label">Confidence</span>
            <span className="rec-conf-value">{recommendation.confidence}%</span>
          </div>
          <div className="rec-conf-track">
            <div
              className="rec-conf-fill"
              style={{
                width: `${recommendation.confidence}%`,
                background: confColor,
                animationDelay: `${index * 80 + 120}ms`,
              }}
            />
          </div>
        </div>
        <button className="rec-action-btn" onClick={onOpenItems}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
          Items
        </button>
      </div>
    </div>
  );
};
