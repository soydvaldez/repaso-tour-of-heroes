import { Component, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../../interface/hero';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { map, Observable, Subscription } from 'rxjs';
import { ActionsService } from '../../../actions/services/actions.service';
import { HeroActions } from '../../../actions/enums/hero-actions.enum';
import { DashboardHeroDetailsComponent } from '../dashboard-hero-details/dashboard-hero-details.component';
import { TooltipDirective } from '../../../commons/tooltip.directive';
import { FormsModule } from '@angular/forms';
import { ConfirmModalComponent } from '../../../commons/confirm-modal/confirm-modal.component';
import { TopHeroService } from '../../service/tophero.service';
import { HeroesService } from '@data/rest/supabase/heroes/heroes-data.service';

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
    FormsModule,
    ConfirmModalComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  topheroes: Hero[] = [];
  topheroesBackup?: Hero[];
  topHeroSubscription!: Subscription;

  public spinnerMessage = 'Loading top heroes...';
  public isLoadingSpinner = false;

  selectedHero?: Hero;

  isDeleted: boolean = false;
  isSyncronized: boolean = true;

  isSelectedAllTopHeroes?: boolean;
  isSelectedTopHero?: boolean = false;

  showModal: boolean = false;
  topHeroes$!: Observable<Hero[]>;
  isDeletedAll: boolean = false;
  selectedHeroes: Hero[] = [];
  // service: IHeroService;

  constructor(
    // private heroFactoryService: HeroFactoryService,
    private apiHeroesService: HeroesService,
    private topheroService: TopHeroService,
    private spinnerService: SpinnerService,
    private actionsService: ActionsService
  ) {
    // this.service = heroFactoryService.getHeroService();
  }

  ngOnInit(): void {
    // this.spinnerService.setMessage('Loading Top Heroes...');
    // this.spinnerService.show();
    this.actionsService.setOptions(HeroActions.ListTopHeroes);
    this.isLoadingSpinner = true;

    this.topHeroSubscription = this.apiHeroesService
      .getHeroes()
      .pipe(
        map((heroesMapper: Hero[]) => {
          return heroesMapper.map((hero: Hero) => {
            const { comicPublishers, ...rest } = hero;
            return {
              ...rest, // Copiar las demás propiedades
              comicPublishers: comicPublishers, // Cambiar `publishers` a `publisher`
              isSelected: false, // Añadir la propiedad `isSelected`
              isDeleted: false, // Añadir la propiedad `isDeleted`
            };
          });
        }),
        map((heroes: Hero[]) => {
          // Filtrar Top Heroes
          return heroes.filter((h) => h.isTophero);
        }),
        map((topheroes) => {
          // Ordenar de menor a mayor:
          return topheroes.sort((a: Hero, b: Hero) => {
            return a.heroStatistics!.ranking - b.heroStatistics!.ranking;
          });
        })
      )
      .subscribe((heroes: Hero[]) => {
        if (heroes && heroes.length > 0) {
          const defaultHeroSelected = heroes[0];
          this.selectedHero = defaultHeroSelected;
          this.spinnerService.hide();
          this.topheroes = heroes;
          this.isLoadingSpinner = false;
        }
      });

    setTimeout(() => {
      this.isSyncronized = false;
    }, 10000);
  }

  ngOnDestroy() {
    if (this.topHeroSubscription) {
      this.topHeroSubscription.unsubscribe();
    }
  }

  currentSelected(hero: Hero) {
    this.selectedHero = hero;
  }

  displaySpinner() {
    this.isLoadingSpinner = true;
  }

  closeSpinner() {
    this.isLoadingSpinner = false;
  }

  updateViewTopHeroes(onDeleteHero: boolean) {
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
    }, 1000);
  }

  selectAllTopheroes() {
    if (!this.isSelectedAllTopHeroes) {
      const selectedAllCheckbox = (h: Hero) => {
        h.isSelected = true;
      };
      this.topheroes?.forEach(selectedAllCheckbox);
      this.isSelectedAllTopHeroes = true;
      return;
    }

    if (this.isSelectedAllTopHeroes) {
      const selectedAllCheckbox = (h: Hero) => {
        h.isSelected = false;
      };
      this.topheroes?.forEach(selectedAllCheckbox);
      this.isSelectedAllTopHeroes = false;
      return;
    }
  }

  selectTophero(hero: Hero) {
    hero.isSelected = !hero.isSelected;
    if (this.topheroes?.every((h) => h.isSelected)) {
      this.isSelectedAllTopHeroes = true;
    } else {
      this.isSelectedAllTopHeroes = false;
      this.isSelectedTopHero = false;
    }

    if (this.topheroes?.some((h) => h.isSelected)) {
      this.isSelectedTopHero = true;
    } else {
      this.isSelectedTopHero = false;
    }
  }

  delete() {
    this.handleModal();
  }

  handleModal() {
    this.showModal = !this.showModal;
  }

  isSelectedElement() {
    return !this.topheroes?.some((h) => h.isSelected);
  }

  handleConfirmation(isConfirmDelete: boolean) {
    this.handleModal();

    if (isConfirmDelete) {
      const heroesSelectedToDeleted = (hero: Hero) => {
        return hero.isSelected;
      };

      const topHeroesToDelete =
        this.topheroes?.filter(heroesSelectedToDeleted) || [];

      if (topHeroesToDelete.length <= 0) {
        console.log(
          'El usuario no selecciono ningun hero, notificar al usuario que debe de seleccionar al menos un hero'
        );
        return;
      }

      if (topHeroesToDelete.length === 1) {
        this.topheroService
          .deleteHeroById(topHeroesToDelete[0].id)
          .subscribe((isHeroDeleted) => {
            console.log(isHeroDeleted);
            if (!isHeroDeleted) {
              console.log('something wrong');
              return;
            }

            const index = this.getHeroIndex(topHeroesToDelete[0].id);
            if (index != undefined && index >= 0) {
              this.topheroes?.splice(index, 1);
              // aplica efectos de borrado
              // Define un settimeout para borrar del dom
            }
          });
        return;
      }

      if (topHeroesToDelete.length > 1) {
        // Seleccionaron todos?
        if (this.isSelectedAll()) {
          this.isDeletedAll = true;
          setTimeout(() => {
            this.isDeletedAll = false;
            this.topheroes = [];
          }, 1000);
          return;
        }

        // Seleccionaron al menos 1. Cual seleccionaron?
        const selectedToDeleted: Hero[] = this.getSelectedHeroes();
        if (selectedToDeleted && selectedToDeleted.length > 0) {
          // prender bandera de borrado
          selectedToDeleted.forEach((hero) => {
            hero.isDeleted = true;
          });

          setTimeout(() => {
            selectedToDeleted.forEach((h) => {
              const index = this.getHeroIndex(h.id);
              this.topheroes.splice(index, 1);
            });
          }, 1000);
          return;
        }

        const idsToDelete = topHeroesToDelete.map((hero) => hero.id);

        this.topheroService
          .deleteHeroesByIds(idsToDelete)
          .subscribe((areHeroesDeleted) => {
            console.log(areHeroesDeleted);
            // si tiene la bandera activa: isSelected borrar
            // consulta indice y borra
            idsToDelete.forEach((id) => {
              if (this.topheroes?.some((h) => h.id === id)) {
                this.topheroes.splice(Number(this.getHeroIndex(id)), 1);
              }
              // handle animation
              this.isDeletedAll = true;
            });
          });
        return;
      }
    }
  }

  isSelectedAll() {
    return this.topheroes.every((h) => h.isSelected);
  }

  getSelectedHeroes() {
    this.selectedHeroes = this.topheroes.filter((h) => {
      return h.isSelected;
    });

    return this.selectedHeroes || [];
  }

  getHeroIndex(heroId: number) {
    return this.topheroes?.findIndex((h) => h.id === heroId);
  }
}
