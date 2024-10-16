import { TestBed } from '@angular/core/testing';

import { ComicPublisherService } from './comic-publisher.service';

describe('ComicPublisherService', () => {
  let service: ComicPublisherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComicPublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
