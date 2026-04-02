import { useState, useEffect } from "react";
import type { HeroRecommendation, ItemSuggestion } from "../types/draft";
import type { Hero } from "../types/hero";
import type { ItemsMap } from "../types/item";
import { fetchItemPopularity, suggestItems, getItemImageUrl } from "../api/draftApi";
import "./ItemBuild.css";

interface Props {
  recommendation: HeroRecommendation;
  heroes: Hero[];
  items: ItemsMap;
  alliedPicks: string[];
  enemyPicks: string[];
  bans: string[];
  userTeam: "radiant" | "dire";
  onClose: () => void;
}

const phaseLabels: Record<string, string> = {
  starting: "Starting",
  early: "Early Game",
  core: "Core",
  luxury: "Luxury / Situational",
};

const phaseOrder = ["starting", "early", "core", "luxury"];

export const ItemBuild = ({
  recommendation,
  heroes,
  items,
  alliedPicks,
  enemyPicks,
  bans,
  userTeam,
  onClose,
}: Props) => {
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const hero = heroes.find((h) => h.localized_name === recommendation.heroName);
    if (!hero) {
      setError("Hero not found");
      setLoading(false);

      return;
    }

    const controller = new AbortController();

    const run = async () => {
      try {
        const popularItems = await fetchItemPopularity(hero.id, items, controller.signal);
        const result = await suggestItems({
          heroName: recommendation.heroName,
          role: recommendation.role,
          alliedPicks,
          enemyPicks,
          bans,
          userTeam,
          popularItems,
        }, controller.signal);
        setSuggestions(result);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          return;
        }
        setError(err instanceof Error ? err.message : "Failed to get item suggestions");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    run();

    return () => controller.abort();
  }, [recommendation, heroes, items, alliedPicks, enemyPicks, bans, userTeam]);

  return (
    <div className="item-build-overlay" onClick={onClose}>
      <div className="item-build-modal" onClick={(e) => e.stopPropagation()}>
        <div className="item-build-header">
          <div>
            <h3>{recommendation.heroName}</h3>
            <span className="item-build-role">{recommendation.role.replace("_", " ")}</span>
          </div>
          <button className="item-build-close" onClick={onClose}>✕</button>
        </div>

        <div className="item-build-content">
          {loading && (
            <div className="item-build-loading">
              <div className="loading-spinner" />
              <span>Generating situational item build...</span>
            </div>
          )}

          {error && (
            <div className="item-build-error">{error}</div>
          )}

          {!loading && !error && suggestions
            .sort((a, b) => phaseOrder.indexOf(a.phase) - phaseOrder.indexOf(b.phase))
            .map((s) => (
              <div key={s.phase} className="item-phase">
                <div className="item-phase-label">{phaseLabels[s.phase] || s.phase}</div>
                <div className="item-phase-items">
                  {s.items.map((itemName, i) => {
                    const imgUrl = getItemImageUrl(items, itemName);

                    return (
                      <div key={`${itemName}-${i}`} className="item-chip" title={itemName}>
                        {imgUrl && <img src={imgUrl} alt={itemName} />}
                        <span>{itemName}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="item-phase-reasoning">{s.reasoning}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
