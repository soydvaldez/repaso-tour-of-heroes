import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Hero } from '../interface/hero';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // private heroesUrl = 'http://localhost:3000/heroes';
  private heroesUrl = 'api/heroes';

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl);
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      tap({
        next: (heroes) => {
          console.log('Recuperando héroes...');
          console.log(heroes);
        },
        error: (err) => {
          console.error('Error recuperando héroes', err);
        },
      })
    );
  }
}
