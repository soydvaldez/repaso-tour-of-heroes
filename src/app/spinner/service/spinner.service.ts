import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoadingState } from '../interface/loading-state';

@Injectable({
  providedIn: 'any'
})
export class SpinnerService {
  private loadingSubject = new BehaviorSubject<LoadingState>({
    isLoading: true,
    message: 'Cargando...',
  });
  public loading$ = this.loadingSubject.asObservable();
  loadingState: LoadingState;

  constructor() {
    this.loadingState = {
      isLoading: false,
      message: 'Cargando...',
    };
    this.loadingSubject.next(this.loadingState);
  }

  setMessage(messageLoading: string) {
    this.loadingState.message = messageLoading;
    this.loadingSubject.next(this.loadingState);
  }

  getMessage(): Observable<LoadingState> {
    return this.loading$;
  }

  show() {
    this.loadingState.isLoading = true;
    this.loadingSubject.next(this.loadingState);
  }

  hide() {
    this.loadingState.isLoading = false;
    this.loadingSubject.next(this.loadingState);
  }
}
