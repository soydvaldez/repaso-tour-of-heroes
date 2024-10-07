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
          severity: 'info',
        });
      }),
      map((topheroes) => {
        return topheroes.sort(
          (a, b) => a.statistics!.ranking - b.statistics!.ranking
        );
      })
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`).pipe(
      tap(() => {
        this.messageService.add({
          source: 'TopheroService',
          message: `deleted TopHero: ${id}`,
          severity: 'INFO',
        });
      })
    );
  }
}
