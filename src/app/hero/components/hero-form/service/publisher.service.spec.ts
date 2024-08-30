import { TestBed } from '@angular/core/testing';

import { PublisherService } from './publisher.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from '../../../../in-memory-data-service.service';
import { Publisher } from '../../../interface/publisher';

describe('PublisherService', () => {
  let publisherService: PublisherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // TestBed.configureTestingModule({});
    // service = TestBed.inject(PublisherService);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
      ],
      providers: [PublisherService],
    });

    publisherService = TestBed.inject(PublisherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(publisherService).toBeTruthy();
  });

  fit('should be return a list of publisher', (done) => {
    publisherService.getPublishers().subscribe((publishers) => {
      expect(publishers.length).toBe(3);

      const list: Publisher[] = getExpectedPublisher();

      publishers.forEach((p, index) => {
        expect(p.id).toBe(list[index].id);
        expect(p.name).toBe(list[index].name);
      });
      done();
    });
  });
});

// Expected list of heroes to compare with api response
function getExpectedPublisher(): Publisher[] {
  return [
    { id: 1, name: 'Marvel Comics' },
    { id: 2, name: 'DC Comics' },
    { id: 3, name: 'Image Comics' },
  ];
}

// Unexpected list of heroes to compare with api response
function getUnexpectedPublisher(): Publisher[] {
  return [];
}
