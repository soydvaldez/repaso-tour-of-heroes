import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './sessionstorage.service';

describe('LocalstorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
