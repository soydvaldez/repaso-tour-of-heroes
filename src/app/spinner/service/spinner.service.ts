import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { LoadingState } from '../interface/loading-state';

@Injectable({
  providedIn: 'any',
})
export class SpinnerService {
  public spinnerHeroForm: boolean = false;

  private spinnerSubject = new BehaviorSubject<LoadingState>({
    isLoading: false,
    message: 'Loading...',
  });
  public spinnerState$ = this.spinnerSubject.asObservable();
  loadingState: LoadingState = {
    isLoading: false,
    message: 'Loading...',
  };

  constructor() {}

  setMessage(messageLoading: string) {
    this.loadingState.message = messageLoading;
    this.spinnerSubject.next(this.loadingState);
  }

  show() {
    this.loadingState.isLoading = true;
    this.spinnerSubject.next(this.loadingState);
  }

  hide() {
    this.loadingState.isLoading = false;
    this.spinnerSubject.next(this.loadingState);
  }
}
