import { useState } from "react";
import type { Hero } from "../types/hero";
import { getHeroImageUrl } from "../types/hero";
import { HeroPicker } from "./HeroPicker";
import "./BansList.css";

interface Props {
  heroes: Hero[];
  bans: string[];
  onChange: (bans: string[]) => void;
  excludeHeroes: string[];
  disabled?: boolean;
}

export const BansList = ({ heroes, bans, onChange, excludeHeroes, disabled }: Props) => {
  const [showPicker, setShowPicker] = useState(false);

  const findHero = (name: string): Hero | undefined => {

    return heroes.find((h) => h.localized_name === name);
  };

  const handleRemove = (name: string) => {
    onChange(bans.filter((b) => b !== name));
  };

  return (
    <div className="bans-section">
      <div className="bans-header">
        <span className="bans-label">Bans</span>
        {!disabled && (
          <button className="bans-add-btn" onClick={() => setShowPicker(true)}>
            + Add Ban
          </button>
        )}
        {bans.length > 0 && !disabled && (
          <button className="bans-clear-btn" onClick={() => onChange([])}>
            Clear all
          </button>
        )}
      </div>

      {bans.length > 0 && (
        <div className="bans-list">
          {bans.map((name) => {
            const hero = findHero(name);

            return (
              <div key={name} className="ban-item">
                {hero && (
                  <img src={getHeroImageUrl(hero.img)} alt={name} />
                )}
                <span className="ban-item-name">{name}</span>
                <div className="ban-cross" />
                {!disabled && (
                  <button
                    className="ban-item-remove"
                    onClick={() => handleRemove(name)}
                  >
                    ✕
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showPicker && (
        <HeroPicker
          heroes={heroes}
          excludeHeroes={excludeHeroes}
          onSelect={(heroName) => {
            onChange([...bans, heroName]);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};
