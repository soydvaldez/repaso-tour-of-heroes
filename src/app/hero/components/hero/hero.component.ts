import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../../interface/hero';
import { CommonModule, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../service/hero.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { HeroFormComponent } from '../hero-form/hero-form.component';
import { catchError, delay, finalize, Observable, tap } from 'rxjs';
import { ActionsComponent } from '../../../actions/actions.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { ActionsService } from '../../../actions/services/actions.service';
import { HeroActions } from '../../../actions/enums/hero-actions.enum';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [
    UpperCasePipe,
    FormsModule,
    NgIf,
    NgFor,
    RouterLink,
    SpinnerComponent,
    HeroFormComponent,
    ActionsComponent,
    SearchBarComponent,
    NgIf,
    CommonModule,
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent implements OnInit, OnDestroy {
  heroesObservable$?: Observable<Hero[]>;

  filteredHeroes: Hero[] = [];
  heroes!: Hero[];

  isLoadingSpinner: boolean = false;
  spinnerMessage: string = '';

  constructor(
    private heroService: HeroService,
    public spinnerService: SpinnerService,
    private actionsService: ActionsService
  ) {}

  ngOnInit(): void {
    // rendered action botton
    this.actionsService.setOptions(HeroActions.List);

    this.isLoadingSpinner = true;
    this.spinnerMessage = 'Loading Héroes...';

    // this.heroesObservable$ = this.heroService
    this.heroService.getHeroes(true).subscribe((heroes) => {
      this.heroes = heroes;
      setTimeout(() => {
        this.isLoadingSpinner = false;
      }, 1000);
    });
    // this.getHeroes();
  }

  ngOnDestroy(): void {
    console.log('restaurando valores');
    const refreshData: boolean = true;
    // this.heroService.getHeroes(refreshData);
  }

  getHeroes() {}
}
