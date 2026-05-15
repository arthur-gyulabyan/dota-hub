import type { Hero } from "../types/hero";
import { getHeroImageUrl } from "../types/hero";
import "./BansList.css";

interface Props {
  heroes: Hero[];
  bans: string[];
  onAdd: () => void;
  onRemove: (name: string) => void;
  disabled?: boolean;
}

export const BansList = ({ heroes, bans, onAdd, onRemove, disabled }: Props) => {
  const findHero = (name: string): Hero | undefined => {

    return heroes.find((h) => h.localized_name === name);
  };

  return (
    <div className="bans-rail">
      <span className="bans-title">
        Bans
        <span className="bans-title-count">{bans.length}/14</span>
      </span>
      <span className="bans-divider" />
      <div className="bans-list">
        {bans.map((name) => {
          const hero = findHero(name);

          return (
            <div key={name} className="ban-chip" title={name}>
              {hero && <img src={getHeroImageUrl(hero.img)} alt={name} />}
              {!disabled && (
                <button
                  className="ban-remove"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ban ${name}`}
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
        <button className="bans-add" onClick={onAdd} disabled={disabled}>+ Ban hero</button>
      </div>
    </div>
  );
};
