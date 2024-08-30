export interface Publisher {
  id: number;
  name: string;
}

export interface Hero {
  id: number;
  name: string;
  year: number;
  publisher: Publisher | null;
}

export interface NewHero {
  name: string;
}
