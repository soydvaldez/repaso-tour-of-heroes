import { Injectable } from '@angular/core';
import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';
import { Hero } from './hero/interface/hero';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  constructor() {}

  createDb(): {} {
    // { id: 11, name: 'Iceman' },
    const heroes = [
      {
        id: 12,
        name: 'Dr. Nice',
        year: 2010,
        publisher: { id: 3, name: 'Image Comics' },
      },
      {
        id: 13,
        name: 'Bombasto',
        year: 2010,
        publisher: { id: 1, name: 'Marvel Comics' },
      },
      {
        id: 14,
        name: 'Celeritas',
        year: 2010,
        publisher: { id: 1, name: 'Marvel Comics' },
      },
      {
        id: 15,
        name: 'Magneta',
        year: 2010,
        publisher: { id: 3, name: 'Image Comics' },
      },
      {
        id: 16,
        name: 'RubberMan',
        year: 2000,
        publisher: { id: 3, name: 'Image Comics' },
      },
      {
        id: 17,
        name: 'Dynama',
        year: 2024,
        publisher: { id: 1, name: 'Marvel Comics' },
      },
      {
        id: 18,
        name: 'Dr. IQ',
        year: 2024,
        publisher: { id: 1, name: 'Marvel Comics' },
      },
      {
        id: 19,
        name: 'Magma',
        year: 2024,
        publisher: { id: 2, name: 'DC Comics' },
      },
      {
        id: 20,
        name: 'Tornado',
        year: 2024,
        publisher: { id: 2, name: 'DC Comics' },
      },
      {
        id: 21,
        name: 'Magneto',
        year: 2024,
        publisher: { id: 1, name: 'Marvel Comics' },
      },
    ];

    // Nueva colección de editoriales de cómics
    const publishers = [
      { id: 1, name: 'Marvel Comics' },
      { id: 2, name: 'DC Comics' },
      { id: 3, name: 'Image Comics' },
    ];

    return { heroes, publishers };
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
        heroTmp.publisher = heroUpdate.publisher;

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
}
