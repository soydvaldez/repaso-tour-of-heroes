// src/app/hero.service.spec.ts
import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';
import { Hero } from '../interface/hero';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../../in-memory-data-service.service';

describe('HeroService', () => {
  let heroService: HeroService;
  let httpMock: HttpTestingController;

  /*beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [HeroService],
    });
    service = TestBed.inject(HeroService);
  });*/

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
      ],
      providers: [HeroService],
    });

    heroService = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve heroes from the API via GET', (done) => {
    heroService.getHeroes().subscribe((heroes) => {
      expect(heroes).toBeTruthy();
      expect(heroes.length).toBeGreaterThan(0);
      expect(heroes[0].id).toBeDefined();
      expect(heroes[0].name).toBeDefined();
      done();
    });

    // Esto se ocupara cuando usas heroesMock
    // const heroesMock=[{{ id: 10, name: 'Dr. Nice' }, { id: 11, name: 'Bombasto' },}];
    // const req = httpMock.expectOne('api/heroes');
    // expect(req.request.method).toBe('GET');
    // req.flush(heroesMock);
  });

  it('should return exactly nine heroes', (done) => {
    heroService.getHeroes().subscribe((heroes) => {
      expect(heroes.length).toBe(9);
      done();
    });
  });

  it('should return heroes with id and name as strings', (done) => {
    heroService.getHeroes().subscribe((heroes) => {
      heroes.forEach((hero: Hero) => {
        expect(hero.id).toBeDefined();
        expect(hero.name).toBeDefined();
        expect(typeof hero.id).toBe('number');
        expect(typeof hero.name).toBe('string');
      });
      done();
    });
  });

  it('should return correct hero names and ids', (done) => {
    const expectedListHeroes: Hero[] = getExpectedHeroes();

    heroService.getHeroes().subscribe((heroes) => {
      heroes.forEach((hero, index) => {
        expect(hero.id).toBe(expectedListHeroes[index].id);
        expect(hero.name).toBe(expectedListHeroes[index].name);
      });
      done();
    });
  });

  it('should not return any unexpected heroes', (done) => {
    let unexpectedListHeroes: Hero[] = getUnexpectedHeroes();
    let lengthList = unexpectedListHeroes.length - 1;
    //
    heroService.getHeroes().subscribe((heroes) => {
      heroes.forEach((hero, index) => {
        if (index < lengthList) {
          expect(hero.id).not.toBe(unexpectedListHeroes[index].id);
          expect(hero.name).not.toBe(unexpectedListHeroes[index].name);
        }
      });
      done();
    });
  });

  // it('should handle error when API fails', (done) => {});
  it('should be saved a new hero', (done) => {
    let saveHero: Hero = {
      id: 21,
      name: 'Hero Name Testing',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    };

    heroService.add(saveHero).subscribe((hero) => {
      expect(hero.id).not.toBeNull();
      expect(hero.name).toBe('Hero Name Testing');
      done();
    });
  });
});

// Expected list of heroes to compare with api response
function getExpectedHeroes(): Hero[] {
  return [
    {
      id: 12,
      name: 'Dr. Nice',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 13,
      name: 'Bombasto',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 14,
      name: 'Celeritas',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 15,
      name: 'Magneta',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 16,
      name: 'RubberMan',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 17,
      name: 'Dynama',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 18,
      name: 'Dr. IQ',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 19,
      name: 'Magma',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 20,
      name: 'Tornado',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
  ];
}

// Unexpected list of heroes to compare with api response
function getUnexpectedHeroes(): Hero[] {
  return [
    {
      id: 21,
      name: 'Dr. Ice',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 22,
      name: 'Mr. Fantastic',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 23,
      name: 'Dr Doom',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
    {
      id: 24,
      name: 'Venom',
      year: 0,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    },
  ];
}
