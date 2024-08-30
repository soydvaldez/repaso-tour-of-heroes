import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HeroActions } from './enums/hero-actions.enum';
import { ActionsService } from './services/actions.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss',
})
export class ActionsComponent implements OnInit {
  action!: HeroActions;
  HeroActions = HeroActions;
  optionsObs$: Observable<string>;

  constructor(private actionsService: ActionsService, private router: Router) {
    this.optionsObs$ = this.actionsService.optionsObs$;
  }

  ngOnInit(): void {
    this.actionsService.default;
    this.router.url;

    this.renderOptions();
  }

  setAction(action: HeroActions) {
    this.action = action;
    // viewHeroes
  }

  renderOptions() {
    this.optionsObs$.subscribe((options) => {
      switch (options) {
        case 'list':
          this.action = HeroActions.List;
          break;
        case 'create':
          this.action = HeroActions.Create;
          break;
        default:
          this.action = HeroActions.ListTopHeroes;
      }
    });
  }
}
