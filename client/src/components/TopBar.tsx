import "./TopBar.css";

const PHASE_STEPS = ["ban", "ban", "pick", "ban", "pick", "pick", "ban", "pick", "pick", "ban"] as const;

interface Props {
  phaseIdx: number;
  onReset: () => void;
}

export const TopBar = ({ phaseIdx, onReset }: Props) => {
  const currentPhase = PHASE_STEPS[phaseIdx] || "pick";

  return (
    <header className="topbar">
      <div className="logo">
        <span className="logo-primary">DOTA</span>
        <span className="logo-accent">HUB</span>
      </div>

      <div className="topbar-divider" />

      <div className="phase-indicator">
        <span className="phase-dot" />
        <div>
          <div className="phase-label">Phase</div>
          <div className="phase-value">
            {currentPhase === "ban" ? "Ban" : "Pick"}
            <span className="phase-step-meta">
              · step {phaseIdx + 1}/{PHASE_STEPS.length}
            </span>
          </div>
        </div>
        <div className="phase-steps">
          {PHASE_STEPS.map((p, i) => (
            <span
              key={i}
              className={`phase-step ${i < phaseIdx ? "active" : ""} ${i === phaseIdx ? "current" : ""}`}
              title={`${p} ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <span className="topbar-spacer" />

      <button className="icon-btn" title="Reset draft" onClick={onReset} aria-label="Reset">
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      </button>
    </header>
  );
};
