export interface Publisher {
  id: number;
  name: string;
}

export interface HeroStatistics {
  id: number;
  popularity: number;
  ranking: number;
}

export interface Hero {
  id: number;
  name: string;
  year: number;
  comicPublishers: Publisher | null;
  isTophero: boolean;
  heroStatistics: HeroStatistics;
  isSelected?: boolean;
  isDeleted?: boolean;
}

export interface NewHero {
  name: string;
}

export interface HeroSave {
  name: string;
  year: number;
  publisher_id: number;
  is_top_hero: boolean;
}
