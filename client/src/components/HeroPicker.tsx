import { useState, useRef, useEffect } from "react";
import type { Hero } from "../types/hero";
import { getHeroImageUrl, ATTR_LABELS, ATTR_ORDER } from "../types/hero";
import "./HeroPicker.css";

interface Props {
  heroes: Hero[];
  excludeHeroes: string[];
  onSelect: (heroName: string) => void;
  onClose: () => void;
}

export const HeroPicker = ({ heroes, excludeHeroes, onSelect, onClose }: Props) => {
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const searchLower = search.toLowerCase();
  const matchesSearch = (hero: Hero) => {
    if (!search) {
      return true;
    }
    const name = hero.localized_name.toLowerCase();
    if (search.length === 1) {
      return name.startsWith(searchLower);
    }

    return name.includes(searchLower);
  };

  const grouped = ATTR_ORDER.map((attr) => ({
    attr,
    label: ATTR_LABELS[attr],
    heroes: heroes.filter((h) => h.primary_attr === attr),
  }));

  return (
    <div className="hero-picker-overlay" onClick={onClose}>
      <div className="hero-picker" onClick={(e) => e.stopPropagation()}>
        <div className="hero-picker-header">
          <span>Select Hero</span>
          <button className="hero-picker-close" onClick={onClose}>✕</button>
        </div>

        <div className="hero-picker-search">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search heroes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="hero-picker-grid">
          {grouped.map(({ attr, label, heroes: group }) => (
            <div key={attr} className="hero-attr-group">
              <div className={`hero-attr-label attr-${attr}`}>{label}</div>
              <div className="hero-attr-heroes">
                {group.map((hero) => {
                  const disabled = excludeHeroes.includes(hero.localized_name);
                  const matches = matchesSearch(hero);
                  const dimmed = search && !matches;

                  return (
                    <div
                      key={hero.id}
                      className={`hero-pick-item ${disabled ? "disabled" : ""} ${matches && search ? "search-match" : ""} ${dimmed ? "search-dimmed" : ""}`}
                      onClick={() => !disabled && !dimmed && onSelect(hero.localized_name)}
                    >
                      <img
                        src={getHeroImageUrl(hero.img)}
                        alt={hero.localized_name}
                        loading="lazy"
                      />
                      <span className="hero-tooltip">{hero.localized_name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
