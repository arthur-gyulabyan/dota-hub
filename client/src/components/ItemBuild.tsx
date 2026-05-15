import { useState, useEffect } from "react";
import type { HeroRecommendation, ItemSuggestion } from "../types/draft";
import type { Hero } from "../types/hero";
import type { ItemsMap } from "../types/item";
import { getHeroImageUrl, ROLE_LABELS, type Role } from "../types/hero";
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

const PHASE_META: { key: ItemSuggestion["phase"]; label: string; range: string }[] = [
  { key: "starting", label: "Starting", range: "0:00 – 2:00" },
  { key: "early", label: "Early Game", range: "2:00 – 10:00" },
  { key: "core", label: "Core", range: "10:00 – 25:00" },
  { key: "luxury", label: "Luxury / Situational", range: "25:00+" },
];

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
  const hero = heroes.find((h) => h.localized_name === recommendation.heroName);
  const [suggestions, setSuggestions] = useState<ItemSuggestion[]>([]);
  const [loading, setLoading] = useState(!!hero);
  const [error, setError] = useState<string | null>(hero ? null : "Hero not found");
  const role = recommendation.role as Role;
  const roleLabel = ROLE_LABELS[role] || recommendation.role;
  const generated = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (!hero) {
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
  }, [hero, recommendation, items, alliedPicks, enemyPicks, bans, userTeam]);

  const byPhase = new Map(suggestions.map((s) => [s.phase, s]));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="item-modal" onClick={(e) => e.stopPropagation()}>
        <div className="item-top">
          <div className="item-top-portrait">
            {hero && <img src={getHeroImageUrl(hero.img)} alt={hero.localized_name} />}
          </div>
          <div className="item-top-text">
            <div className="item-top-title">{recommendation.heroName}</div>
            <div className="item-top-sub">
              {roleLabel} · Situational build · Generated {generated}
            </div>
          </div>
          <button className="picker-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="item-body">
          {loading && (
            <div className="item-loading">
              <div className="analyzing-dots"><span /><span /><span /></div>
              <div className="analyzing-text">Building situational items…</div>
            </div>
          )}

          {error && <div className="item-error">{error}</div>}

          {!loading && !error && PHASE_META.map((p) => {
            const data = byPhase.get(p.key);
            if (!data) {
              return null;
            }

            return (
              <div key={p.key} className="item-phase">
                <div className="item-phase-col">
                  <span className="item-phase-label">{p.label}</span>
                  <span className="item-phase-range">{p.range}</span>
                </div>
                <div className="item-phase-content">
                  <div className="item-chips">
                    {data.items.map((itemName, i) => {
                      const imgUrl = getItemImageUrl(items, itemName);

                      return (
                        <span key={`${itemName}-${i}`} className="item-chip" title={itemName}>
                          <span className="item-icon">
                            {imgUrl ? <img src={imgUrl} alt={itemName} /> : itemName.slice(0, 2).toUpperCase()}
                          </span>
                          {itemName}
                        </span>
                      );
                    })}
                  </div>
                  <p className="item-phase-note">{data.reasoning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
