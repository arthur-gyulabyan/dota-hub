export interface Hero {
  id: number;
  name: string;
  localized_name: string;
  primary_attr: "str" | "agi" | "int" | "all";
  attack_type: "Melee" | "Ranged";
  roles: string[];
  img: string;
  icon: string;
}

export const STEAM_CDN = "https://cdn.cloudflare.steamstatic.com";

export const getHeroImageUrl = (img: string): string => {

  return `${STEAM_CDN}${img}`;
};

export const ATTR_LABELS: Record<string, string> = {
  str: "Strength",
  agi: "Agility",
  int: "Intelligence",
  all: "Universal",
};

export const ATTR_ORDER = ["str", "agi", "int", "all"] as const;

export const ATTR_COLORS: Record<string, string> = {
  str: "#f87171",
  agi: "#4ade80",
  int: "#60a5fa",
  all: "#c084fc",
};

export type Role = "carry" | "midlane" | "offlane" | "soft_support" | "hard_support";

export const ROLE_LABELS: Record<Role, string> = {
  carry: "Carry",
  midlane: "Mid",
  offlane: "Offlane",
  soft_support: "Soft Sup",
  hard_support: "Hard Sup",
};

export const ROLE_COLORS: Record<Role, string> = {
  carry: "#fbbf24",
  midlane: "#60a5fa",
  offlane: "#f87171",
  soft_support: "#4ade80",
  hard_support: "#a78bfa",
};
