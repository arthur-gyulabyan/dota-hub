import { useState, useRef, useEffect } from "react";
import type { Hero } from "../types/hero";
import { getHeroImageUrl, ATTR_LABELS, ATTR_ORDER, ATTR_COLORS } from "../types/hero";
import "./HeroPicker.css";

export type PickerTarget = { side: "radiant" | "dire"; index: number } | { side: "ban" };

interface Props {
  heroes: Hero[];
  excludeNames: string[];
  bannedNames: string[];
  target: PickerTarget;
  onSelect: (heroName: string) => void;
  onClose: () => void;
}

export const HeroPicker = ({ heroes, excludeNames, bannedNames, target, onSelect, onClose }: Props) => {
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const s = search.toLowerCase();

  const grouped = ATTR_ORDER.map((attr) => ({
    attr,
    label: ATTR_LABELS[attr],
    heroes: heroes.filter((h) => h.primary_attr === attr),
  }));

  const targetLabel = (() => {
    if (target.side === "ban") {
      return "→ Ban";
    }
    const side = target.side === "radiant" ? "Radiant" : "Dire";

    return `→ ${side} · slot ${target.index + 1}`;
  })();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="picker" onClick={(e) => e.stopPropagation()}>
        <div className="picker-top">
          <span className="picker-title">Select Hero</span>
          <span className="picker-target">{targetLabel}</span>
          <div className="picker-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              ref={inputRef}
              placeholder="Search heroes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="picker-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="picker-body">
          {grouped.map(({ attr, label, heroes: group }) => (
            <div key={attr} className="picker-group">
              <div className="picker-group-head">
                <span
                  className="picker-group-dot"
                  style={{ background: ATTR_COLORS[attr], boxShadow: `0 0 6px ${ATTR_COLORS[attr]}` }}
                />
                <span className="picker-group-title" style={{ color: ATTR_COLORS[attr] }}>{label}</span>
                <span className="picker-group-count">{group.length}</span>
              </div>
              <div className="picker-grid">
                {group.map((hero) => {
                  const picked = excludeNames.includes(hero.localized_name);
                  const banned = bannedNames.includes(hero.localized_name);
                  const disabled = picked || banned;
                  const matches = !search || hero.localized_name.toLowerCase().includes(s);
                  const dimmed = !!search && !matches;

                  return (
                    <button
                      key={hero.id}
                      type="button"
                      className={`picker-hero ${picked ? "picked" : ""} ${banned ? "banned" : ""} ${matches && search ? "match" : ""} ${dimmed ? "dimmed" : ""}`}
                      onClick={() => !disabled && !dimmed && onSelect(hero.localized_name)}
                      disabled={disabled}
                    >
                      <img src={getHeroImageUrl(hero.img)} alt={hero.localized_name} loading="lazy" />
                      <span className="picker-tooltip">{hero.localized_name}</span>
                    </button>
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
