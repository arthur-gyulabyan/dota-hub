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
