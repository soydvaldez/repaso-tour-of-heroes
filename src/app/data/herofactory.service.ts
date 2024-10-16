import { Injectable } from '@angular/core';
// import { SupabaseService } from './rest/supabase/supabase-data.service';
import { HeroesService } from '@data/rest/supabase/heroes/heroes-data.service';
import { LocalStorageService } from './persistence/sessionstorage.service';
import { environment } from '../../environments/environment';
import { IHeroService } from './hero';
import { ComicPublisherService } from './rest/supabase/comicspublisher/comic-publisher.service';

@Injectable({
  providedIn: 'root',
})
export class HeroFactoryService {
  constructor(
    private apiHeroesService: HeroesService,
    private comicPublisherService: ComicPublisherService,
    private localStorageService: LocalStorageService
  ) {}

  getHeroService(): IHeroService {
    switch (environment.profile) {
      case 'prod':
      // return this.apiHeroesService;
      case 'dev':
        return this.apiHeroesService;
        break;
      default:
        return this.apiHeroesService;
      // return this.localStorageService;
    }
  }

  getPublisherService() {
    return this.comicPublisherService;
  }
}
