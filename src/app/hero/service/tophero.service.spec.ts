import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { Hero } from '../interface/hero';
import { TopHeroService } from './tophero.service';

describe('TopheroService', () => {
  let service: TopHeroService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        // HttpClientTestingModule,
        // InMemoryWebApiModule.forRoot(InMemoryDataService),
      ],
      providers: [TopHeroService],
    });

    service = TestBed.inject(TopHeroService);
    // httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya solicitudes pendientes
    // httpTestingController.verify();
  });

  it('should be return all top heroes', (done) => {
    service.getTopHeroes().subscribe((heroes: Hero[]) => {
      expect(4).toEqual(heroes.length);
      done();
    });

    // const req = httpTestingController.expectOne('api/topheroes');
    // req.flush(getMockTopHeroes());

    // expect(req.request.method).toBe('GET');
  });
});

function getMockTopHeroes() {
  const mockTopHeroes = [
    {
      id: 12,
      name: 'Dr. Nice',
      year: 2010,
      publisher: { id: 3, name: 'Image Comics' },
      isTophero: true,
      heroStatistics: {
        popularity: 9999,
        ranking: 0,
      },
    },
    {
      id: 13,
      name: 'Bombasto',
      year: 2010,
      publisher: { id: 1, name: 'Marvel Comics' },
      isTophero: true,
      heroStatistics: {
        popularity: 9950,
        ranking: 3,
      },
    },
    {
      id: 14,
      name: 'Celeritas',
      year: 2010,
      publisher: { id: 1, name: 'Marvel Comics' },
      isTophero: true,
      heroStatistics: {
        popularity: 9998,
        ranking: 2,
      },
    },
    {
      id: 15,
      name: 'Magneta',
      year: 2010,
      publisher: { id: 3, name: 'Image Comics' },
      isTophero: true,
      heroStatistics: {
        popularity: 8000,
        ranking: 4,
      },
    },
  ];

  return mockTopHeroes;
}
