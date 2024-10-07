import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroService } from '../../service/hero.service';
import { Hero } from '../../interface/hero';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { Subscription } from 'rxjs';
import { ActionsService } from '../../../actions/services/actions.service';
import { HeroActions } from '../../../actions/enums/hero-actions.enum';
import { DashboardHeroDetailsComponent } from '../dashboard-hero-details/dashboard-hero-details.component';
import { TooltipDirective } from '../../../commons/tooltip.directive';
import { TopheroService } from '../../service/tophero.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    SpinnerComponent,
    DashboardHeroDetailsComponent,
    TooltipDirective,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  topheroes?: Hero[];
  heroSubscription!: Subscription;

  renderHeroDetail!: number;

  public spinnerMessage = 'Loading top heroes...';
  public isLoadingSpinner = false;

  isHeroSelected: boolean = false;

  hero?: Hero;
  selectedHero?: Hero;
  hasTopHeroes: boolean = true;

  isVisible = true; // Controla si el elemento está en el DOM
  isFadingOut = false; // Controla la animación de salida

  isDeleted: boolean = false;
  isSyncronized: boolean = true;

  toggleVisibility() {
    if (this.isVisible) {
      // Si está visible, aplicar la animación de salida antes de remover el elemento
      this.isFadingOut = true;
      setTimeout(() => {
        this.isVisible = false;
        this.isFadingOut = false; // Reiniciar la clase de animación
      }, 500); // Coincide con la duración de la animación (0.5s)
    } else {
      // Si está oculto, simplemente mostrarlo sin retraso
      this.isVisible = true;
    }
  }

  toggle() {
    this.isVisible = !this.isVisible;
  }

  constructor(
    private TopheroService: TopheroService,
    private spinnerService: SpinnerService,
    private actionsService: ActionsService
  ) {}

  ngOnInit(): void {
    // this.spinnerService.setMessage('Loading Top Heroes...');
    // this.spinnerService.show();
    this.actionsService.setOptions(HeroActions.ListTopHeroes);
    this.isLoadingSpinner = true;
    this.heroSubscription = this.TopheroService.getTopHeroes().subscribe(
      (heroes) => {
        if (heroes && heroes.length > 0) {
          const defaultHeroSelected = heroes[0];
          this.renderHeroDetail = defaultHeroSelected.id;
          this.selectedHero = defaultHeroSelected;
          this.spinnerService.hide();
          this.topheroes = heroes;
          this.isLoadingSpinner = false;
        }
      }
    );

    setTimeout(() => {
      this.isSyncronized = false;
    }, 10000);
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

  closeDetail() {
    this.renderHeroDetail = -1;
  }

  displaySpinner() {
    this.isLoadingSpinner = true;
  }

  closeSpinner() {
    this.isLoadingSpinner = false;
  }

  updateViewTopHeroes(heroHasBeenDeleted: boolean) {
    this.isDeleted = true;

    // this.selectedHero === true && isDeleted
    let index = this.topheroes?.findIndex(
      (h) => h.id === this.selectedHero?.id
    );

    setTimeout(() => {
      // Eliminado...
      this.displaySpinner();

      if (index !== -1 && index != undefined) {
        this.topheroes!.splice(index, 1);
      }

      setTimeout(() => {
        this.isDeleted = false;
        this.closeSpinner();
        if (this.topheroes && this.topheroes.length > 0) {
          this.selectedHero = this.topheroes[0];
        }
      }, 1000);
    }, 2000);
  }
}
