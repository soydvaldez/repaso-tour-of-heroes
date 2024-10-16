import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from '../../messages/service/message.service';
import { Hero } from '../interface/hero';
import { tap } from 'rxjs';
import { HeroesService } from '@data/rest/supabase/heroes/heroes-data.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TopHeroService {
  // private url: string = 'api/topheroes';

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private supabase: HeroesService
  ) {}

  getTopHeroes() {
    return this.supabase.getHeroes();
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
