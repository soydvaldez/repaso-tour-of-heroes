import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Hero } from './hero/interface/hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  constructor() {}

  createDb(): {} {
    const heroes: Hero[] = [
      {
        id: 12,
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
        id: 13,
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
        id: 14,
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
        id: 15,
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
        id: 16,
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
        id: 17,
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
        id: 18,
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
        id: 19,
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
        id: 20,
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
        id: 21,
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

    // Nueva colección de editoriales de cómics
    const comicPublisherss = [
      { id: 1, name: 'Marvel Comics' },
      { id: 2, name: 'DC Comics' },
      { id: 3, name: 'Image Comics' },
    ];
    
    const topheroes = [
      {
        id: 12,
        name: 'Dr. Nice',
        year: 2010,
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: true,
        heroStatistics: {
          popularity: 9999,
          ranking: 1,
        },
      },
      {
        id: 13,
        name: 'Bombasto',
        year: 2010,
        comicPublishers: { id: 1, name: 'Marvel Comics' },
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
        comicPublishers: { id: 1, name: 'Marvel Comics' },
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
        comicPublishers: { id: 3, name: 'Image Comics' },
        isTophero: true,
        heroStatistics: {
          popularity: 8000,
          ranking: 4,
        },
      },
    ];

    return { heroes, comicPublisherss, topheroes };
  }
  genId(heroes: Hero[]): number {
    return heroes.length > 0
      ? Math.max(...heroes.map((hero) => hero.id)) + 1
      : 11;
  }

  post(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    const collection = reqInfo.collection;

    const newHero = reqInfo.utils.getJsonBody(reqInfo.req);

    newHero.id = this.genId(collection);
    collection.push(newHero);

    return reqInfo.utils.createResponse$(() => ({
      body: newHero,
      status: 201,
    }));
  }

  put(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    const heroes: Hero[] = reqInfo.collection;
    const heroUpdate = reqInfo.utils.getJsonBody(reqInfo.req);

    if (heroes.some((h) => h.id === heroUpdate.id)) {
      let heroTmp = heroes.find((h) => h.id === heroUpdate.id);
      if (heroTmp) {
        heroTmp.name = heroUpdate.name;
        heroTmp.year = heroUpdate.year;
        heroTmp.comicPublishers = heroUpdate.comicPublishers;

        return reqInfo.utils.createResponse$(() => ({
          body: heroUpdate,
          status: 201,
        }));
      }
    }

    return reqInfo.utils.createResponse$(() => ({
      body: { message: 'Hero not Found' },
      status: 404,
    }));
  }

  delete(reqInfo: RequestInfo) {
    const collectionName = reqInfo.collectionName;
    const heroes: Hero[] = reqInfo.collection;
    const heroIdDelete = reqInfo.id || -1;

    if (!heroes.some((h) => h.id === heroIdDelete)) {
      return reqInfo.utils.createResponse$(() => ({
        body: 'Hero not found',
        status: 404,
      }));
    }

    const index = heroes.findIndex((h) => h.id === heroIdDelete);
    if (index === -1) {
      return reqInfo.utils.createResponse$(() => ({
        body: 'Hero not found',
        status: 404,
      }));
    } else {
      heroes.splice(index, 1);

      return reqInfo.utils.createResponse$(() => ({
        body: 'Hero has been deleted!',
        status: 200,
      }));
    }
  }
}
