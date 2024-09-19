import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeroActions } from './enums/hero-actions.enum';
import { ActionsService } from './services/actions.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent implements OnInit, OnDestroy {
  action!: HeroActions;
  HeroActions = HeroActions;
  optionsObs$: Observable<string>;

  optionSelected: string = HeroActions.ListTopHeroes;
  actionSubcription?: Subscription;

  constructor(private actionsService: ActionsService, private router: Router) {
    this.optionsObs$ = this.actionsService.optionsObs$;
  }

  ngOnInit(): void {
    this.actionsService.default;
    this.router.url;

    this.renderOptions();
  }

  ngOnDestroy(): void {
    if (this.actionSubcription) {
      this.actionSubcription.unsubscribe();
    }
  }

  setAction(action: HeroActions) {
    this.optionSelected = action;
  }

  renderOptions() {
    this.actionSubcription = this.optionsObs$.subscribe((options) => {
      switch (options) {
        case 'list':
          this.action = HeroActions.List;
          this.optionSelected = HeroActions.List;
          break;
        case 'create':
          this.action = HeroActions.Create;
          this.optionSelected = HeroActions.Create;
          break;
        default:
          this.action = HeroActions.ListTopHeroes;
          this.optionSelected = HeroActions.ListTopHeroes;
      }
    });
  }

  isSelected(option: HeroActions) {
    switch (option) {
      case 'list':
        this.action = HeroActions.List;
        break;
      case 'create':
        this.action = HeroActions.Create;
        break;
      default:
        this.action = HeroActions.ListTopHeroes;
    }
  }
}
