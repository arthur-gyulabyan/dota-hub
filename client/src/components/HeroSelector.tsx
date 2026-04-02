import { DOTA_HEROES } from "../data/heroes";

interface Props {
  label: string;
  picks: string[];
  onChange: (picks: string[]) => void;
  excludeHeroes: string[];
  maxPicks?: number;
}

export function HeroSelector({ label, picks, onChange, excludeHeroes, maxPicks = 5 }: Props) {
  const availableHeroes = DOTA_HEROES.filter(
    (h) => !excludeHeroes.includes(h) && !picks.includes(h)
  );

  function addHero(hero: string) {
    if (picks.length < maxPicks) {
      onChange([...picks, hero]);
    }
  }

  function removeHero(hero: string) {
    onChange(picks.filter((p) => p !== hero));
  }

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ fontWeight: "bold", display: "block", marginBottom: "8px" }}>
        {label} ({picks.length}/{maxPicks})
      </label>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "8px", minHeight: "32px" }}>
        {picks.map((hero) => (
          <span
            key={hero}
            onClick={() => removeHero(hero)}
            style={{
              background: "#333",
              padding: "4px 10px",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {hero} ✕
          </span>
        ))}
      </div>

      {picks.length < maxPicks && (
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) addHero(e.target.value);
          }}
          style={{ padding: "6px", width: "100%", maxWidth: "300px" }}
        >
          <option value="">Select a hero...</option>
          {availableHeroes.map((hero) => (
            <option key={hero} value={hero}>{hero}</option>
          ))}
        </select>
      )}
    </div>
  );
}
