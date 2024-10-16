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
        map((heroes: Hero[]) => {
          return heroes.filter((h) => h.isTophero);
        }),
        map((topheroes) => {
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
              // Agrega animacion
            });
          });
        return;
      }
    }
  }

  getHeroIndex(heroId: number) {
    return this.topheroes?.findIndex((h) => h.id === heroId);
  }

  restoreHeroes() {
    if (this.topheroes?.length <= 0) {
      const restoreHeroes: Hero[] = [
        {
          id: 12,
          name: 'Dr. Nice',
          year: 2010,
          comicPublishers: { id: 3, name: 'Image Comics' },
          isTophero: true,
          heroStatistics: {
            id: 1,
            popularity: 9999,
            ranking: 1,
          },
        },
        {
          id: 13,
          name: 'Bombasto',
          year: 2010,
          comicPublishers: { id: 1, name: 'Marvel Comics' },
          isTophero: true,
          heroStatistics: {
            id: 2,
            popularity: 9950,
            ranking: 3,
          },
        },
        {
          id: 14,
          name: 'Celeritas',
          year: 2010,
          comicPublishers: { id: 1, name: 'Marvel Comics' },
          isTophero: true,
          heroStatistics: {
            id: 3,
            popularity: 9998,
            ranking: 2,
          },
        },
        {
          id: 15,
          name: 'Magneta',
          year: 2010,
          comicPublishers: { id: 3, name: 'Image Comics' },
          isTophero: true,
          heroStatistics: {
            id: 4,
            popularity: 8000,
            ranking: 4,
          },
        },
      ];

      this.topheroService.save(restoreHeroes).subscribe((heroes: any) => {
        this.topheroes = heroes;
      });
    }
  }
}
