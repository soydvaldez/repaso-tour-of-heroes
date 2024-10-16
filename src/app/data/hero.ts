import { Observable } from 'rxjs';
import { Hero, HeroSave } from '../hero/interface/hero';
import { HeroRequest } from './rest/supabase/interface/hero.interface';

export interface IHeroService {
  getHeroes(): Observable<Hero[]>;
  createHero(heroSave: HeroRequest[]): Observable<Hero>;
  updateHero(hero: Hero): Observable<Hero>;
  deleteHero(id: number): Observable<Hero>;
}
