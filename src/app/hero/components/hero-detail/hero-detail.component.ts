import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, Location, NgIf, UpperCasePipe } from '@angular/common';
import { HeroService } from '../../service/hero.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Hero, Publisher } from '../../interface/hero';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import {
  catchError,
  finalize,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { SelectComponent } from '../hero-form/select/select.component';
import { PublisherService } from '../hero-form/service/publisher.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [
    NgIf,
    FormsModule,
    UpperCasePipe,
    SpinnerComponent,
    ReactiveFormsModule,
    SelectComponent,
    CommonModule,
    NotificationComponent,
  ],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.scss',
})
export class HeroDetailComponent implements OnInit, OnDestroy {
  hero?: Hero;
  heroSubcription$!: Subscription;
  public heroForm!: FormGroup;

  public isLoadingSpinner: boolean = false;
  public spinnerMessage: string = '';

  public notificationMessage: string = '';
  public notificationType: 'success' | 'error' = 'success';

  publisherControl!: FormControl<number>;
  public notFound: boolean = false;

  subcription$!: Subscription;
  publishers$!: Observable<Publisher[]>;

  public years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
    2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
    2000,
  ];

  constructor(
    private location: Location,
    private heroService: HeroService,
    private publisherService: PublisherService,
    private route: ActivatedRoute,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.publishers$ = this.publisherService.getPublishers();

    // this.spinnerService.setMessage('Loading Details...');
    // this.spinnerService.show();

    this.isLoadingSpinner = true;
    this.spinnerMessage = 'Loading Hero Details...';

    this.heroForm = new FormGroup({
      id: new FormControl<number>(0),
      name: new FormControl<string>(''),
      year: new FormControl<number>(2024),
      publisher: new FormControl<number>(3),
    });

    this.subcription$ = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          return this.heroService.getHero(id).pipe(
            catchError((error) => {
              console.error('Error:', error);
              this.notFound = true;
              return of(null); // Terminar el flujo con un observable vacío en caso de error
            }),
            finalize(() => {
              // this.spinnerService.hide();
              this.isLoadingSpinner = false;
            })
          );
        })
      )
      .subscribe((hero: Hero | null) => {
        if (hero) {
          this.hero = hero;
        }
        if (hero) {
          this.heroForm.get('name')?.setValue(hero.name);
          this.heroForm.get('id')?.setValue(hero.id);
          this.hero = hero;

          this.heroForm.setValue({
            id: hero.id,
            name: hero.name,
            year: hero.year,
            publisher: hero.publisher?.id,
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subcription$) {
      this.subcription$.unsubscribe();
    }
  }
  
  onSubmit() {
    this.spinnerMessage = 'updating hero...';
    this.isLoadingSpinner = true;

    let hero: Hero = this.createHero();
    let publisherId = this.heroForm.get('publisher')?.value;

    this.getPublisher(publisherId)
      .pipe(
        switchMap((publisher) => {
          hero.publisher = publisher;
          return this.heroService.update(hero);
        }),
        tap((hero) => {
          this.notificationMessage = 'Hero updated!';
          this.notificationType = 'success';
          console.log(`Hero updated! ${JSON.stringify(hero)}`);

          setTimeout(() => {
            this.notificationMessage = '';
          }, 5000);
        }),
        finalize(() => (this.isLoadingSpinner = false))
      )
      .subscribe();
  }

  private getPublisher(publisherId: number) {
    return this.publisherService.getPublisherById(publisherId);
  }

  private createHero(): Hero {
    return {
      id: this.heroForm.get('id')?.value,
      name: this.heroForm.get('name')?.value,
      year: this.heroForm.get('year')?.value,
      publisher: null,
    };
  }

  goBack() {
    this.location.back();
  }

  // En el componente padre
  getPublisherControl(): FormControl<number> {
    return this.heroForm.get('publisher') as FormControl<number>;
  }
}
