import type { ReactNode } from "react";
import { ROLE_COLORS, type Role } from "../types/hero";
import "./SeatBar.css";

interface RoleTile {
  v: Role;
  label: string;
  icon: ReactNode;
}

const ROLE_TILES: RoleTile[] = [
  {
    v: "carry",
    label: "Carry",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
      </svg>
    ),
  },
  {
    v: "midlane",
    label: "Midlane",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    v: "offlane",
    label: "Offlane",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L4 5v7c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V5l-8-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    v: "soft_support",
    label: "Soft Support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    v: "hard_support",
    label: "Hard Support",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M4.93 4.93l2.12 2.12" />
        <path d="M16.95 16.95l2.12 2.12" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="M4.93 19.07l2.12-2.12" />
        <path d="M16.95 7.05l2.12-2.12" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

interface Props {
  userTeam: "radiant" | "dire";
  onUserTeamChange: (team: "radiant" | "dire") => void;
  myRole: Role | null;
  onMyRoleChange: (role: Role | null) => void;
  disabled?: boolean;
}

export const SeatBar = ({ userTeam, onUserTeamChange, myRole, onMyRoleChange, disabled }: Props) => {
  const activeTile = ROLE_TILES.find((r) => r.v === myRole);

  return (
    <div className="seatbar">
      <div className="selector-strip">
        <span className="selector-section-label">Your Team</span>
        <div className="selector-group">
          <button
            className={`selector-tile text radiant ${userTeam === "radiant" ? "active" : ""}`}
            onClick={() => onUserTeamChange("radiant")}
            aria-pressed={userTeam === "radiant"}
            disabled={disabled}
          >
            <span className="selector-text">Radiant</span>
            <span className="selector-glow" />
          </button>
          <button
            className={`selector-tile text dire ${userTeam === "dire" ? "active" : ""}`}
            onClick={() => onUserTeamChange("dire")}
            aria-pressed={userTeam === "dire"}
            disabled={disabled}
          >
            <span className="selector-text">Dire</span>
            <span className="selector-glow" />
          </button>
        </div>

        <span className="selector-divider" />

        <span className="selector-section-label">
          Your Lane
          <span className="selector-section-aux">optional</span>
        </span>
        <div className="selector-group">
          {ROLE_TILES.map((r) => {
            const active = myRole === r.v;
            const style = active
              ? ({ "--tile-active-color": ROLE_COLORS[r.v] } as React.CSSProperties)
              : undefined;

            return (
              <button
                key={r.v}
                className={`selector-tile icon role-${r.v} ${active ? "active" : ""}`}
                onClick={() => onMyRoleChange(active ? null : r.v)}
                aria-pressed={active}
                aria-label={r.label}
                title={r.label}
                style={style}
                disabled={disabled}
              >
                <span className="selector-icon">{r.icon}</span>
                <span className="selector-tooltip">{r.label}</span>
                <span className="selector-glow" />
              </button>
            );
          })}
        </div>

        {myRole && (
          <button
            className="selector-clear"
            onClick={() => onMyRoleChange(null)}
            title="Clear lane"
            disabled={disabled}
          >
            Any lane
          </button>
        )}
      </div>

      <span className="seatbar-spacer" />

      <span className="seatbar-hint">
        AI targets{" "}
        <strong style={{ color: userTeam === "radiant" ? "var(--radiant-bright)" : "var(--dire-bright)" }}>
          {userTeam === "radiant" ? "Radiant" : "Dire"}
        </strong>
        {activeTile && (
          <>
            {" · "}
            <strong style={{ color: ROLE_COLORS[activeTile.v] }}>
              {activeTile.label}
            </strong>
          </>
        )}
      </span>
    </div>
  );
};
