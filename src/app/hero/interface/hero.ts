export interface Publisher {
  id: number;
  name: string;
}

export interface Hero {
  id: number;
  name: string;
  year: number;
  publisher: Publisher | null;
  tophero?: boolean;
  statistics?: Statistics;
}

export interface NewHero {
  name: string;
}

export interface Statistics {
  popularity: number;
  ranking: number;
}
