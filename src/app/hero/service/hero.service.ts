import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  BehaviorSubject,
  catchError,
  delay,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { Hero } from '../interface/hero';
import { MessageService } from '../../messages/service/message.service';
import { Message } from '../../messages/interface/message';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  // private heroesUrl = 'http://localhost:3000/heroes';
  private heroesUrl = 'api/heroes';

  private heroes: Hero[] = [];
  private allHeroes: Hero[] = [];

  private heroCreatedSubject = new Subject<boolean>();
  public heroCreated$ = this.heroCreatedSubject.asObservable();

  private heroesUpdatedSource = new Subject<boolean>();
  public heroesUpdated$ = this.heroesUpdatedSource.asObservable();

  private heroesSubject$ = new BehaviorSubject<Hero[]>(this.heroes);
  public heroesObservable$ = this.heroesSubject$.asObservable();

  private isDatafetched = false;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'Application/json',
    }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {
    // setTimeout(() => {
    //   this.filterHeroes('value');
    // }, 5000);
    // setTimeout(() => {
    //   this.restoreState();
    // }, 20000);
  }

  notifyHeroCreated(success: boolean) {
    this.heroCreatedSubject.next(success);
  }

  // Implementa algoritmo para obtener los top heroes
  getTopHeroes() {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(() => {
        this.log({
          source: 'HeroService',
          message: `fetched Top Heroes`,
          severity: 'INFO',
        });
      }),
      map((heroes) => (heroes = heroes.splice(1, 4)))
    );
  }

  getHeroes(refreshData?: boolean): Observable<Hero[]> {
    if (this.isDatafetched && !refreshData) {
      this.log({
        source: 'HeroService',
        message: `fetched all heroes from cache`,
        severity: 'INFO',
      });
      return this.heroesObservable$;
    } else {
      this.fetchHeroes();
      return this.heroesObservable$;
    }
  }

  private fetchHeroes() {
    this.http
      .get<Hero[]>(this.heroesUrl)
      .pipe(
        tap({
          next: (heroes) => {
            this.isDatafetched = true;
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
        }),
        catchError((err) => {
          this.log({
            source: 'HeroService',
            message: `error when try fetched all heroes`,
            severity: 'INFO',
          });
          // Maneja el error para que el observable no falle ni cause recargas inesperadas
          return of([]); // o lanza el error de nuevo si quieres que falle la suscripción
        })
      )
      .subscribe((heroes) => {
        this.isDatafetched = true;
        this.allHeroes = heroes;
        this.heroesSubject$.next(heroes);
      });
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroesUrl}/${id}`).pipe(
      // delay(2000),
      tap({
        next: (heroe) => {
          console.log(heroe);
          this.log({
            source: 'HeroService',
            message: `fetched heroe ${JSON.stringify(heroe)}`,
            severity: 'INFO',
          });
        },
        error: (err) => {
          console.error(`error when try fetched heroe with id=${id}`, err);
          this.log({
            source: 'HeroService',
            message: `error when try fetched heroe with id=${id}`,
            severity: 'ERROR',
          });
        },
      })
    );
  }

  add(saveHero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, saveHero).pipe(
      tap({
        next: (hero: Hero) => {
          this.heroesUpdatedSource.next(true);
          this.log({
            source: 'HeroService',
            message: `Added New Hero (${JSON.stringify(hero)})`,
            severity: 'INFO',
          });
        },
        error: (err) => {
          this.log({
            source: 'HeroService',
            message: `Hero Already Exists`,
            severity: 'ERROR',
          });
        },
      }),
      catchError((err) => {
        this.log({
          source: 'HeroService',
          message: `error when try save hero`,
          severity: 'INFO',
        });
        // Maneja el error para que el observable no falle ni cause recargas inesperadas
        return of(); // o lanza el error de nuevo si quieres que falle la suscripción
      })
    );
  }

  update(updateHero: Hero) {
    return this.http
      .put<Hero>(`${this.heroesUrl}/14`, updateHero, this.httpOptions)
      .pipe(
        tap({
          next: (hero) => {
            this.log({
              source: 'HeroService',
              message: `update hero ${JSON.stringify(hero)}`,
              severity: 'INFO',
            });
          },
          error: (err) => {
            this.log({
              source: 'HeroService',
              message: err,
              severity: 'ERROR',
            });
          },
        }),
        catchError((err) => {
          this.log({
            source: 'HeroService',
            message: err,
            severity: 'ERROR',
          });
          return of();
        })
      );
  }

  delete(heroId: number) {
    return this.http.delete<Hero>(
      `${this.heroesUrl}/${heroId}`,
      this.httpOptions
    );
  }

  log(message: Message) {
    this.messageService.add(message);
  }

  checkHeroExists(checkHeroName: string): Observable<boolean> {
    // Función auxiliar para comparar cadenas
    function compareStrings(str1: string, str2: string): boolean {
      const normalizeStr = (s: string) => {
        return s
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase();
      };
      return normalizeStr(str1) === normalizeStr(str2);
    }

    // Función para verificar si existe el héroe
    function exists(checkHeroName: string, existingHeroes: Hero[]): boolean {
      return existingHeroes.some((hero) =>
        compareStrings(hero.name, checkHeroName)
      );
    }

    this.getHeroes(true).subscribe((heroes) => {});

    // Obtener los héroes y verificar si el héroe a chequear existe
    return this.getHeroes(true).pipe(
      map((heroes: Hero[]) => {
        console.log(heroes);
        return exists(checkHeroName, heroes);
      }) // Transforma el array de héroes en un booleano
    );
  }

  filterHeroes(value: string) {
    const filteredHeroes = this.allHeroes.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.id.toString().includes(value)
    );

    return this.heroesSubject$.next(filteredHeroes);
  }

  notifyChange() {
    // this.heroesSubject$.next();
  }

  restoreState() {
    const refreshData: boolean = true;
    this.getHeroes(refreshData).subscribe();
  }
}
