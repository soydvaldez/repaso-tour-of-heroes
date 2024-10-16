import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Hero, HeroSave } from '../../hero/interface/hero';
import { IHeroService } from '../hero';
import { HeroRequest } from '../rest/supabase/interface/hero.interface';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService implements IHeroService {
  private readonly heroesKey: string = 'heroes';

  constructor() {
    this.initializeDefaultData();
  }
  createHero(heroSave: HeroRequest[]): Observable<Hero> {
    throw new Error('Method not implemented.');
  }
  updateHero(hero: Hero): Observable<Hero> {
    throw new Error('Method not implemented.');
  }
  deleteHero(id: number): Observable<Hero> {
    throw new Error('Method not implemented.');
  }

  initializeDefaultData() {
    const existingHeroes = sessionStorage.getItem(this.heroesKey);

    if (!existingHeroes) {
      const defaultHeroes: Hero[] = this.getMockHeroes();
      
      sessionStorage.setItem(
        this.heroesKey,
        JSON.stringify(this.getMockHeroes())
      );
    }
  }

  getHeroes(): Observable<Hero[]> {
    const list = sessionStorage.getItem(this.heroesKey);

    if (list) {
      return of(JSON.parse(list));
    }
    return of([]);
  }
  

  cleanLocalStorage() {
    sessionStorage.removeItem('heroes');
  }

  getMockHeroes() {
    return [
      {
        id: 12,
        name: 'Dr. Nice',
        year: 2010,
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: true,
        heroStatistics: {
          id: 1,
          popularity: 9999,
          ranking: 1,
        },
      },
      {
        id: 13,
        name: 'Bombasto',
        year: 2010,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
        isTophero: true,
        heroStatistics: {
          id: 2,
          popularity: 9950,
          ranking: 3,
        },
      },
      {
        id: 14,
        name: 'Celeritas',
        year: 2010,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
        isTophero: true,
        heroStatistics: {
          id: 3,
          popularity: 9998,
          ranking: 2,
        },
      },
      {
        id: 15,
        name: 'Magneta',
        year: 2010,
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: true,
        heroStatistics: {
          id: 4,
          popularity: 8000,
          ranking: 4,
        },
      },
    ];
  }
}
