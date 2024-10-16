export interface comic_publisher {
  id: number;
  name: string;
}

export interface hero_statistics {
  id: number;
  popularity: number;
  ranking: number;
}

export interface HeroResponse {
  id: number;
  name: string;
  year: number;
  comic_publishers: comic_publisher | null;
  is_top_hero: boolean;
  hero_statistics: hero_statistics;
  isSelected?: boolean;
}

// export interface HeroRequest {
  // name: string;
  // year: number;
  // comic_publishers: comic_publisher | null;
  // is_top_hero: boolean;
  // hero_statistics: hero_statistics;
// }

export interface HeroRequest {
  name: string;
  year: number;
  publisher_id: number;
  is_top_hero: boolean;
}


export interface Hero {
  id: number;
  name: string;
  year: number;
  comicPublishers: comic_publisher | null;
  isTophero: boolean;
  heroStatistics: hero_statistics;
  isSelected?: boolean;
}