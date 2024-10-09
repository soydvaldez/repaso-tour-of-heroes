import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from '../../messages/service/message.service';
import { Hero } from '../interface/hero';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopheroService {
  private url: string = 'api/topheroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  getTopHeroes() {
    return this.http.get<Hero[]>(this.url).pipe(
      tap(() => {
        return this.messageService.add({
          source: 'TopheroService',
          message: 'All Top Heroes fetched',
          severity: 'INFO',
        });
      }),
      map((topheroes) => {
        const sortTopHeroes = (a: Hero, b: Hero) => {
          return a.statistics!.ranking - b.statistics!.ranking;
        };

        const initializedHeroes = topheroes.map((hero) => ({
          ...hero,
          isSelected: false, // Añadir la propiedad `isSelected`
        }));

        return initializedHeroes.sort(sortTopHeroes);
      }),
      map((top) => {
        return top;
      })
    );
  }

  save(topheroes: Hero[]) {
    return this.http.post('api/topheroes', topheroes).pipe(
      tap(() => {
        this.messageService.add({
          source: 'TopheroService',
          message: `register top of heroes`,
          severity: 'INFO',
        });
      })
    );
  }

  deleteHeroById(id: number) {
    return this.http.delete(`api/topheroes/${id}`).pipe(
      tap(() => {
        this.messageService.add({
          source: 'TopheroService',
          message: `Hero with id ${id} was deleted!`,
          severity: 'INFO',
        });
      })
    );
  }

  deleteHeroesByIds(ids: number[]) {
    return this.http.post('api/topheroes', { ids }).pipe(
      tap(() => {
        this.messageService.add({
          source: 'TopheroService',
          message: `Heroes with ids: {${ids}} was deleted!`,
          severity: 'INFO',
        });
      })
    );
  }
}
