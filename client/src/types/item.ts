export interface DotaItem {
  id: number;
  dname: string;
  img: string;
  cost: number;
}

export type ItemsMap = Record<string, DotaItem>;
