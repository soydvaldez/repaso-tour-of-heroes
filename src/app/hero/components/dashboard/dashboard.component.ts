import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroService } from '../../service/hero.service';
import { Hero } from '../../interface/hero';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { Subscription } from 'rxjs';
import { ActionsService } from '../../../actions/services/actions.service';
import { HeroActions } from '../../../actions/enums/hero-actions.enum';
import { DashboardHeroDetailsComponent } from '../dashboard-hero-details/dashboard-hero-details.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, SpinnerComponent, DashboardHeroDetailsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  heroes?: Hero[];
  heroSubscription!: Subscription;

  renderHeroDetail: number = 14;

  public spinnerMessage = 'Loading top heroes...';
  public isLoadingSpinner = false;

  isHeroSelected: boolean = false;

  hero?: Hero;
  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private spinnerService: SpinnerService,
    private actionsService: ActionsService
  ) {}

  ngOnInit(): void {
    // this.spinnerService.setMessage('Loading Top Heroes...');
    // this.spinnerService.show();
    this.actionsService.setOptions(HeroActions.ListTopHeroes);

    this.isLoadingSpinner = true;
    this.heroSubscription = this.heroService
      .getTopHeroes()
      .subscribe((heroes) => {
        this.spinnerService.hide();
        this.heroes = heroes;
        this.isLoadingSpinner = false;
      });
  }

  ngOnDestroy() {
    if (this.heroSubscription) {
      this.heroSubscription.unsubscribe();
    }
  }

  currentSelected(hero: Hero) {
    this.selectedHero = hero;
    this.renderHeroDetails(this.selectedHero.id);
  }

  renderHeroDetails(id: number) {
    this.renderHeroDetail = id;
  }

  cleanDetail() {
    this.renderHeroDetail = -1;
  }
}
