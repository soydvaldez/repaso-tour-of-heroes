import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, tap } from 'rxjs';
import { Publisher } from '../../../interface/publisher';
import { MessageService } from '../../../../messages/service/message.service';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private publisherUrl = 'api/publishers';

  private publisherSubject$: BehaviorSubject<Publisher[]> = new BehaviorSubject<
    Publisher[]
  >([]);
  public publisher$ = this.publisherSubject$.asObservable();
  private publishersLoaded = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  setPublisher(selectedPublisher: Publisher) {
    this.messageService.add({
      source: 'PublisherServices',
      message: `SelectComponent: selected a Publisher - ${JSON.stringify(
        selectedPublisher
      )}`,
      severity: 'INFO',
    });
  }

  getPublishers(): Observable<Publisher[]> {
    if (!this.publishersLoaded) {
      this.http
        .get<Publisher[]>(this.publisherUrl)
        .pipe(
          tap((publishers) => {
            this.messageService.add({
              source: 'PublisherService',
              message: 'Fetched all publishers',
              severity: 'INFO',
            });
          })
        )
        .subscribe((publishers) => {
          this.publisherSubject$.next(publishers);
          this.publishersLoaded = true;
        });
    }

    return of([
      { id: 1, name: 'Marvel Comics' },
      { id: 2, name: 'DC Comics' },
      { id: 3, name: 'Image Comics' },
    ]);
  }

  getPublisherById(id: number): Observable<Publisher> {
    return this.http.get<Publisher>(`${this.publisherUrl}/${id}`).pipe(
      tap((publisher) => {
        this.messageService.add({
          source: 'PublisherService',
          message: `fetched publisher by id ${id}`,
          severity: 'INFO',
        });
      })
    );
  }
}
