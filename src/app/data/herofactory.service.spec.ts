import { TestBed } from '@angular/core/testing';

import { HeroFactoryService } from './herofactory.service';
import { environment } from '../../environments/environment';
import { IHeroService } from './hero';

describe('HeroservicefactoryService', () => {
  let service: HeroFactoryService;
  let heroService: IHeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroFactoryService);
    heroService = service.getHeroService();
  });

  it('should be created', (done) => {
    expect(heroService).toBeTruthy();
    done();
  });

  it('should be dev environment', (done) => {
    expect('dev').toEqual(environment.profile);
    done();
  });  
});
