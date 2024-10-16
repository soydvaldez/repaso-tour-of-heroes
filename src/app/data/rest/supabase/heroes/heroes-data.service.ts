import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  catchError,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
// import { Hero, HeroSave } from '../../../../hero/interface/hero';
import {
  Hero,
  HeroRequest,
  HeroResponse,
} from '@data/rest/supabase/interface/hero.interface';
import { MessageService } from '@message/service/message.service';
import { IHeroService } from '@data/hero';
import { HeroAdapter } from '@data/rest/supabase/adapter/hero.adapter';
import { ClientService } from '@data/rest/supabase/client.service';

// En esta clase esta la logica para interactuar con supabase

@Injectable({
  providedIn: 'root',
})
export class HeroesService implements IHeroService {
  supabase: SupabaseClient;

  constructor(
    private messageService: MessageService,
    private clientService: ClientService
  ) {
    this.supabase = clientService.supabase;
  }

  createHero(heroSave: HeroRequest | HeroRequest[]): Observable<Hero> {
    const promise = this.supabase
      .from('heroes')
      .insert(heroSave)
      .rollback()
      .select(
        `
        id
      `
      )
      .returns<{ id: number }[]>();

    return from(promise).pipe(
      tap((response) => {
        return this.messageService.add({
          source: 'TopheroService',
          message: 'All Top Heroes fetched',
          severity: 'INFO',
        });
      }),
      switchMap((response) => {
        const { data, error, status } = response;
        if (error) {
          throw new Error(error.message);
        }

        if (!data) {
          throw new Error('Error: server cannot create a hero resource');
        }

        if (status === 201) {
          console.log('Hero created!');
        }

        const heroSavedID = data[0].id;
        return this.getHeroById(heroSavedID);
      })
    );
  }

  updateHero(hero: Hero): Observable<Hero> {
    return of(hero);
  }
  deleteHero(id: number): Observable<Hero> {
    return this.getHeroById(id);
  }

  getHeroes() {
    const promise = this.supabase
      .from('heroes')
      .select(
        `
        id, 
        name, 
        year, 
        is_top_hero,
        comic_publishers (
          id, 
          name
        ), 
        hero_statistics(
          id,
          popularity,
          ranking
        )
      `
      )
      .returns<HeroResponse[]>();

    return from(promise).pipe(
      tap(() => {
        return this.messageService.add({
          source: 'TopheroService',
          message: 'All Top Heroes fetched',
          severity: 'INFO',
        });
      }),
      map((response) => {
        const { data, error, status } = response;
        let heroesMapper: Hero[] = [];
        if (data && data?.length > 0) {
          heroesMapper = data?.map((h) => HeroAdapter.mapHeroResponseToHero(h));
        }

        return heroesMapper.map((hero: Hero) => {
          const { comicPublishers, ...rest } = hero;
          return {
            ...rest, // Copiar las demás propiedades
            comicPublishers: comicPublishers, // Cambiar `publishers` a `publisher`
            isSelected: false, // Añadir la propiedad `isSelected`
          };
        });
      }),
      catchError((err) => {
        const error = new Error(err);
        return throwError(() => err);
      })
    );
  }

  getHeroById(id: number) {
    const promise = this.supabase
      .from('heroes')
      .select(
        `
        id, 
        name, 
        year, 
        is_top_hero,
        comic_publishers (
          id, 
          name
        ), 
        hero_statistics(
          id,
          popularity,
          ranking
        )
      `
      )
      .eq('id', id)
      .returns<HeroResponse[]>();

    return from(promise).pipe(
      map((response) => {
        const { data, error, status } = response;
        if (error || status != 200) throw new Error('error supabase client');
        const hero: HeroResponse = data[0];
        if (hero == undefined || hero === null)
          throw new Error('Hero not exists');
        return HeroAdapter.mapHeroResponseToHero(hero);
      }),
      catchError((err) => {
        console.error(err);
        throw err;
      })
    );
  }

  getLastHeroIdRegistered() {
    const promise = this.supabase
      .from('heroes')
      .select('id', { count: 'exact' })
      .order('id', { ascending: false })
      .limit(1)
      .single<{ id: number | undefined }>();
    return from(promise).pipe(
      map((response) => {
        const { data, error } = response;
        if (error) throw error;
        const id: number | undefined = data.id;
        if (id === undefined) throw new Error('not found id');
        return id;
      })
    );
  }

  migrateAllHeroes() {
    const heroes: Hero[] = [
      {
        id: 1,
        name: 'Dr. Nice',
        year: 2010,
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: true,
        heroStatistics: {
          id: 1,
          popularity: 9999,
          ranking: 0,
        },
      },
      {
        id: 2,
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
        id: 3,
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
        id: 4,
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
      {
        id: 5,
        name: 'RubberMan',
        year: 2000,
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: false,
        heroStatistics: {
          id: 5,
          popularity: 8999,
          ranking: 4,
        },
      },
      {
        id: 6,
        name: 'Dynama',
        year: 2024,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
        isTophero: false,
        heroStatistics: {
          id: 6,
          popularity: 7000,
          ranking: 0,
        },
      },
      {
        id: 7,
        name: 'Dr. IQ',
        year: 2024,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
        isTophero: false,
        heroStatistics: {
          id: 7,
          popularity: 6000,
          ranking: 0,
        },
      },
      {
        id: 8,
        name: 'Magma',
        year: 2024,
        comicPublishers: { id: 2, name: 'DC Comics' },
        isTophero: false,
        heroStatistics: {
          id: 8,
          popularity: 5000,
          ranking: 0,
        },
      },
      {
        id: 9,
        name: 'Tornado',
        year: 2024,
        comicPublishers: { id: 2, name: 'DC Comics' },
        isTophero: false,
        heroStatistics: {
          id: 9,
          popularity: 4000,
          ranking: 0,
        },
      },
      {
        id: 10,
        name: 'Magneto',
        year: 2024,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
        isTophero: false,
        heroStatistics: {
          id: 10,
          popularity: 3000,
          ranking: 0,
        },
      },
    ];
    const heroesResquest: HeroRequest[] = heroes.map((h) => {
      return HeroAdapter.mapHeroToHeroRequest(h);
    });

    this.createHero(heroesResquest);
  }
}
