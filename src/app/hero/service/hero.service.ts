import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Hero } from '../interface/hero';
import { MessageService } from '../../messages/service/message.service';
import { Message } from '../../messages/interface/message';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // private heroesUrl = 'http://localhost:3000/heroes';
  private heroesUrl = 'api/heroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap({
        next: (heroes) => {
          this.log({
            source: 'HeroService',
            message: `fetched all heroes`,
            severity: 'INFO',
          });
        },
        error: (err) => {
          this.log({
            source: 'HeroService',
            message: `error when try fetched heroes`,
            severity: 'ERROR',
          });
        },
      })
    );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      tap({
        next: (heroe) => {
          console.log(heroe);
          this.log({
            source: 'HeroService',
            message: `fetched heroe with id=${id}`,
            severity: 'INFO'
          });
        },
        error: (err) => {
          console.error(`error when try fetched heroe with id=${id}`, err);
          this.log({
            source: 'HeroService',
            message: `error when try fetched heroe with id=${id}`,
            severity: 'ERROR'
          });
        },
      })
    );
  }

  log(message: Message) {
    this.messageService.add(message);
  }
}
