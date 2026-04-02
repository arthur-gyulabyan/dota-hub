import { useState } from "react";
import type { Hero } from "../types/hero";
import { getHeroImageUrl } from "../types/hero";
import { HeroPicker } from "./HeroPicker";
import "./DraftBoard.css";

interface Props {
  heroes: Hero[];
  userTeam: "radiant" | "dire";
  radiantPicks: string[];
  direPicks: string[];
  onRadiantChange: (picks: string[]) => void;
  onDireChange: (picks: string[]) => void;
  disabled?: boolean;
}

export const DraftBoard = ({
  heroes,
  userTeam,
  radiantPicks,
  direPicks,
  onRadiantChange,
  onDireChange,
  disabled,
}: Props) => {
  const [pickerSlot, setPickerSlot] = useState<{ side: "radiant" | "dire"; index: number } | null>(null);

  const allSelected = [...radiantPicks, ...direPicks];

  const findHero = (name: string): Hero | undefined => {

    return heroes.find((h) => h.localized_name === name);
  };

  const handleSlotClick = (side: "radiant" | "dire", index: number) => {
    if (disabled) {
      return;
    }
    const picks = side === "radiant" ? radiantPicks : direPicks;
    if (picks[index]) {
      return;
    }
    setPickerSlot({ side, index });
  };

  const handleHeroSelect = (heroName: string) => {
    if (!pickerSlot) {
      return;
    }
    if (pickerSlot.side === "radiant") {
      onRadiantChange([...radiantPicks, heroName]);
    } else {
      onDireChange([...direPicks, heroName]);
    }
    setPickerSlot(null);
  };

  const handleRemove = (side: "radiant" | "dire", index: number) => {
    if (disabled) {
      return;
    }
    if (side === "radiant") {
      onRadiantChange(radiantPicks.filter((_, i) => i !== index));
    } else {
      onDireChange(direPicks.filter((_, i) => i !== index));
    }
  };

  const renderSlot = (side: "radiant" | "dire", index: number) => {
    const picks = side === "radiant" ? radiantPicks : direPicks;
    const heroName = picks[index];
    const hero = heroName ? findHero(heroName) : null;

    return (
      <div
        key={`${side}-${index}`}
        className={`draft-slot ${hero ? "filled" : "empty"} ${side}`}
        onClick={() => !hero && handleSlotClick(side, index)}
      >
        {hero ? (
          <>
            <img src={getHeroImageUrl(hero.img)} alt={hero.localized_name} />
            <div className="draft-slot-name">{hero.localized_name}</div>
            {!disabled && (
              <button
                className="draft-slot-remove"
                onClick={(e) => { e.stopPropagation(); handleRemove(side, index); }}
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className="draft-slot-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="draft-board">
        <div className="draft-headers">
          <div className="draft-team-header radiant">
            <div className="draft-team-icon" />
            <span className="draft-team-label">Radiant</span>
            {userTeam === "radiant" && <span className="draft-team-you">You</span>}
          </div>
          <div className="draft-header-spacer" />
          <div className="draft-team-header dire">
            <div className="draft-team-icon" />
            <span className="draft-team-label">Dire</span>
            {userTeam === "dire" && <span className="draft-team-you">You</span>}
          </div>
        </div>

        <div className="draft-slots-row">
          <div className="draft-slots">
            {[0, 1, 2, 3, 4].map((i) => renderSlot("radiant", i))}
          </div>
          <div className="draft-vs"><span>VS</span></div>
          <div className="draft-slots">
            {[0, 1, 2, 3, 4].map((i) => renderSlot("dire", i))}
          </div>
        </div>
      </div>

      {pickerSlot && (
        <HeroPicker
          heroes={heroes}
          excludeHeroes={allSelected}
          onSelect={handleHeroSelect}
          onClose={() => setPickerSlot(null)}
        />
      )}
    </>
  );
};
