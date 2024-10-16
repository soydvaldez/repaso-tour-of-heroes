import { TestBed } from '@angular/core/testing';
import { HeroesService } from './heroes-data.service';
import { Observable, of, switchMap } from 'rxjs';
import { Hero, HeroStatistics, Publisher } from '@app/hero/interface/hero';
import { HeroRequest } from '../interface/hero.interface';

fdescribe('SupabaseDataService', () => {
  let heroesService: HeroesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    heroesService = TestBed.inject(HeroesService);
  });

  fit('should be created a heroesService instance', () => {
    expect(heroesService).toBeTruthy();
  });

  it('should return all heroes', (done) => {
    heroesService.getHeroes().subscribe((heroes) => {
      expect(12).toEqual(heroes.length);
      done();
    });
  });

  it('should create a new hero', (done) => {
    const heroSavedExpected: HeroRequest = {
      name: 'Hero testing',
      year: 2000,
      publisher_id: 3,
      is_top_hero: false,
    };

    const comicPublisherExpected: Publisher = {
      id: 3,
      name: 'Image Comics',
    };

    const heroStatisticsExpected: HeroStatistics = {
      id: 0,
      popularity: 0,
      ranking: 0,
    };

    const createHero$ = heroesService.createHero(heroSavedExpected);

    createHero$.subscribe({
      next: (heroCreated) => {
        if (heroCreated.comicPublishers) {
          expect(comicPublisherExpected).toEqual(heroCreated.comicPublishers);
        }

        if (heroCreated.heroStatistics) {
          const { id, popularity, ranking } = heroCreated.heroStatistics;

          heroStatisticsExpected.id = id;
          expect(heroStatisticsExpected).toEqual(heroCreated.heroStatistics);

          expect(typeof id).toBe('number');
          expect(typeof popularity).toBe('number');
          expect(typeof ranking).toBe('number');
        }

        expect(heroSavedExpected.name).toBe(heroCreated.name);
        expect(heroSavedExpected.publisher_id).toBe(
          heroCreated.comicPublishers!.id
        );
        expect(heroSavedExpected.is_top_hero).toBe(heroCreated.isTophero);

        done();
      },
      error: (heroNotFound) => {
        let messageError =
          'Expected an Hero, but got a error message instead. Details error:' +
          heroNotFound.message;
        fail(messageError);
        done();
      },
    });
  });

  it('should return a list of Heroes when an array is passed', (done) => {});

  it('should update a Hero when service.updateHero is called', (done) => {
    restoreHeroState();
    const comicPublisherUpdatedExpected: Publisher = {
      id: 3,
      name: 'Image Comics',
    };

    const heroStatisticsUpdatedExpected: HeroStatistics = {
      id: 4,
      popularity: 0,
      ranking: 0,
    };

    const heroUpdatedExpected: Hero = {
      id: 4,
      name: 'Magneta',
      year: 2010,
      isTophero: false,
      comicPublishers: comicPublisherUpdatedExpected,
      heroStatistics: heroStatisticsUpdatedExpected,
    };
    // heroesService.updateHero()
  });

  it('should return a Hero when an ID is passed.', (done) => {
    const expectedComicPublisher: Publisher = {
      id: 3,
      name: 'Image Comics',
    };

    const heroStatisticsExpected: HeroStatistics = {
      id: 1,
      popularity: 0,
      ranking: 0,
    };

    let heroExpected: Hero = {
      id: 1,
      name: 'Dr. Nice',
      year: 2010,
      isTophero: true,
      comicPublishers: expectedComicPublisher,
      heroStatistics: heroStatisticsExpected,
    };

    heroesService.getHeroById(1).subscribe((hero: Hero) => {
      if (hero === undefined) {
        fail('The object is null; it must be assigned a valid value.');
      }

      if (hero.comicPublishers === undefined || hero.comicPublishers === null) {
        fail('The object is null; it must be assigned a valid value.');
      }

      if (hero.heroStatistics === undefined || hero.heroStatistics === null) {
        fail('The object is null; it must be assigned a valid value.');
      }
      expect(hero.id).toEqual(heroExpected.id);
      expect(hero.name).toEqual(heroExpected.name);
      expect(hero.isTophero).toEqual(heroExpected.isTophero);
      expect(hero.year).toEqual(heroExpected.year);
      done();
    });
  });

  it('Should be not return a Hero when the id not exists', (done) => {
    heroesService.getHeroById(99999).subscribe({
      next: (hero) => {
        fail('Expected an error, but got a hero instead.');
        done();
      },
      error: (err) => {
        expect(err.message).toBe('Hero not exists');
        done();
      },
    });
  });

  it('Should be return a heroStatistics object per Hero', (done) => {
    heroesService.getHeroById(1).subscribe((hero) => {
      expect(hero).toBeUndefined();
      done();
    });
  });

  function restoreHeroState() {
    const comicPublisher: Publisher = {
      id: 3,
      name: 'Image Comics',
    };

    const heroStatistics: HeroStatistics = {
      id: 4,
      popularity: 0,
      ranking: 0,
    };

    const heroBeforeUpdated: Hero = {
      id: 4,
      name: 'Magneta',
      year: 2010,
      isTophero: false,
      comicPublishers: comicPublisher,
      heroStatistics: heroStatistics,
    };

    let restoreState$: Observable<Hero> =
      heroesService.updateHero(heroBeforeUpdated);
    restoreState$.subscribe((heroRestore) => {
      expect('Magneta').toEqual(heroRestore.name);
    });
  }
});
