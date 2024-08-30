import { Injectable } from '@angular/core';
import { HeroActions } from '../enums/hero-actions.enum';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ActionsService {
  options: string[] = [];
  default = HeroActions.List;

  optionsSubject = new Subject<string>();
  optionsObs$ = this.optionsSubject.asObservable();

  constructor() {}

  getOptions() {
    return this.options;
  }

  setOptions(action: any) {
    this.optionsSubject.next(action);
  }
}
