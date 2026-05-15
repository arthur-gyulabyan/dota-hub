import type { Hero } from "../types/hero";
import { getHeroImageUrl } from "../types/hero";
import "./DraftBoard.css";

type Side = "radiant" | "dire";

interface NextSlot {
  side: Side;
  index: number;
}

interface Props {
  heroes: Hero[];
  userTeam: Side;
  radiant: (string | null)[];
  dire: (string | null)[];
  nextSlot: NextSlot | null;
  onPickSlot: (side: Side, index: number) => void;
  onRemove: (side: Side, index: number) => void;
  disabled?: boolean;
}

export const DraftBoard = ({
  heroes,
  userTeam,
  radiant,
  dire,
  nextSlot,
  onPickSlot,
  onRemove,
  disabled,
}: Props) => {
  const findHero = (name: string | null): Hero | undefined => {
    if (!name) {
      return undefined;
    }

    return heroes.find((h) => h.localized_name === name);
  };

  const renderSlot = (side: Side, idx: number) => {
    const list = side === "radiant" ? radiant : dire;
    const heroName = list[idx];
    const hero = findHero(heroName);
    const isNext = !disabled && nextSlot?.side === side && nextSlot?.index === idx;

    return (
      <div
        key={`${side}-${idx}`}
        className={`slot ${hero ? "filled" : "empty"} ${side} ${isNext ? "next" : ""}`}
        onClick={() => !hero && !disabled && onPickSlot(side, idx)}
      >
        <span className="slot-index">{idx + 1}</span>
        {hero ? (
          <>
            <div className="slot-portrait">
              <img src={getHeroImageUrl(hero.img)} alt={hero.localized_name} />
            </div>
            <div className="slot-name">{hero.localized_name}</div>
            {!disabled && (
              <button
                className="slot-remove"
                onClick={(e) => { e.stopPropagation(); onRemove(side, idx); }}
                aria-label="Remove"
              >
                ✕
              </button>
            )}
          </>
        ) : (
          <div className="slot-plus">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        )}
      </div>
    );
  };

  const radiantCount = radiant.filter(Boolean).length;
  const direCount = dire.filter(Boolean).length;

  return (
    <div className="board">
      <div className="team-column radiant">
        <div className="team-head">
          <span className="team-dot" />
          <span className="team-name">Radiant</span>
          {userTeam === "radiant" && <span className="team-you-tag">You</span>}
          <span className="team-avg">{radiantCount}/5 picked</span>
        </div>
        <div className="slots">
          {[0, 1, 2, 3, 4].map((i) => renderSlot("radiant", i))}
        </div>
      </div>

      <div className="board-center">
        <div className="vs-line" />
        <div className="vs-mark">VERSUS</div>
      </div>

      <div className="team-column dire">
        <div className="team-head">
          <span className="team-dot" />
          <span className="team-name">Dire</span>
          {userTeam === "dire" && <span className="team-you-tag">You</span>}
          <span className="team-avg">{direCount}/5 picked</span>
        </div>
        <div className="slots">
          {[0, 1, 2, 3, 4].map((i) => renderSlot("dire", i))}
        </div>
      </div>
    </div>
  );
};
