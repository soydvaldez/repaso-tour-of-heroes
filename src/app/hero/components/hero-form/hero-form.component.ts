import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MessageService } from '../../../messages/service/message.service';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { HeroService } from '../../service/hero.service';
import { SelectComponent } from './select/select.component';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ActionsComponent } from '../../../actions/actions.component';
import { LoadingState } from '../../../spinner/interface/loading-state';
import { catchError, Observable, of, Subscription, switchMap, tap } from 'rxjs';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { Hero, Publisher } from '../../interface/hero';
import { NotificationComponent } from '../notification/notification.component';
import { PublisherService } from './service/publisher.service';
import { Message } from '../../../messages/interface/message';
import { ActionsService } from '../../../actions/services/actions.service';
import { HeroActions } from '../../../actions/enums/hero-actions.enum';

@Component({
  standalone: true,
  imports: [
    SpinnerComponent,
    ReactiveFormsModule,
    SelectComponent,
    RouterLink,
    ActionsComponent,
    NgIf,
    AsyncPipe,
    NotificationComponent,
    CommonModule,
  ],
  selector: 'app-hero-form',
  templateUrl: './hero-form.component.html',
  styleUrls: ['./hero-form.component.scss'],
})
export class HeroFormComponent implements OnInit, OnDestroy {
  public heroForm!: FormGroup;
  isLoadingSpinner: boolean = false;
  messageSpinner: string = 'Loading Hero Form...';

  spinnerState$: Observable<LoadingState>;

  notificationMessage: string = '';
  notificationType: 'success' | 'error' = 'success';

  public heroCreated$: Observable<boolean>;

  saveHeroSubscription!: Subscription;

  checkHeroExistsSub$!: Subscription;

  public years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
    2012, 2011, 2010, 2009, 2008, 2007, 2006, 2005, 2004, 2003, 2002, 2001,
    2000,
  ];

  defaultYear: number = 2024;
  comicPublishers$!: Observable<Publisher[]>;

  btnText: string = 'Cancel';
  buttonColor: string = '#104781;';
  isVisibleNotification: boolean = false;
  notificationTimeout: any;

  constructor(
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private heroService: HeroService,
    private comicPublishersService: PublisherService,
    private location: Location,
    private actionsService: ActionsService
  ) {
    // Para ser notificado de cambios de estado
    this.spinnerState$ = this.spinnerService.spinnerState$;
    this.heroCreated$ = heroService.heroCreated$;
  }

  ngOnInit(): void {
    // this.notificationMessage = 'Holamundo';

    this.actionsService.setOptions(HeroActions.Create);

    this.comicPublishers$ = this.comicPublishersService.getPublishers();
    this.isLoadingSpinner = true;

    this.heroForm = new FormGroup({
      name: new FormControl<string>('', Validators.required),
      year: new FormControl<number>(2024),
      comicPublishers: new FormControl<number>(1),
    });

    this.messageService.add({
      severity: 'INFO',
      source: 'HeroFormComponent',
      message: 'Hero Form rendered',
    });

    setTimeout(() => {
      this.isLoadingSpinner = false;
    }, 1000);

    let ref = document.getElementsByTagName(
      'app-notification'
    )[0] as HTMLElement;
    console.log(document.getElementsByTagName('app-notification'));
  }

  ngOnDestroy(): void {
    if (this.saveHeroSubscription) {
      this.saveHeroSubscription.unsubscribe();
    }

    if (this.checkHeroExistsSub$) {
      this.checkHeroExistsSub$.unsubscribe();
    }
  }

  onSubmit(): void {
    this.isLoadingSpinner = true;
    this.messageSpinner = 'Saving a Hero...';

    const newHero = this.createHero();
    const comicPublishersId = this.heroForm.get('comicPublishers')?.value;

    if (!newHero.name) {
      this.setNotification('Hero name is required', 'error');
      this.isLoadingSpinner = false;

      let inputName = document.getElementById('name');
      if (inputName) {
        inputName.style.outline = '1px solid red';
        setTimeout(() => {
          inputName.style.outline = '';
        }, 15000);
      }
      return;
    }

    this.checkHeroExistsSub$ = this.checkHeroExists(newHero.name)
      .pipe(
        tap((exists: boolean) => {
          if (exists) {
            this.setNotification(
              '¡Héroe ya registrado. Escoge otro nombre!',
              'error'
            );
            throw new Error('Héroe ya registrado');
          }
        }),
        switchMap(() => this.comicPublishersService.getPublisherById(comicPublishersId)),
        tap((comicPublishers) => {
          if (!comicPublishers) {
            this.setNotification('Publisher no encontrado', 'error');
            throw new Error('Publisher no encontrado');
          }
          return comicPublishers;
        }),
        switchMap((comicPublishers) =>
          this.heroService.add({ ...newHero, comicPublishers })
        ),
        tap(() => this.setNotification('¡Héroe creado con éxito!', 'success')),
        catchError((error) => {
          this.isLoadingSpinner = false;
          setTimeout(() => {
            this.notificationMessage = '';
          }, 5000);
          this.log({
            source: 'HeroFormComponent',
            message: 'Hero Already Exists',
            severity: 'ERROR',
          });
          return of(); // Terminar el flujo con un observable vacío en caso de error
        })
      )
      .subscribe(() => {
        this.isLoadingSpinner = false;
        this.btnText = 'Regresar';
        this.buttonColor = '#d4d4d4';
      });
  }

  // Método para crear un nuevo héroe a partir del formulario
  private createHero(): Hero {
    if (!this.heroForm.get('name')?.value) {
      name: this.heroForm.get('name')?.invalid;
    }

    let hero: Hero = {
      id: Math.floor(Math.random() * 1000), // Genera un ID ficticio o usa uno real si es necesario
      name: this.heroForm.get('name')?.value,
      year: this.heroForm.get('year')?.value,
      comicPublishers: null,
      isTophero: false,
      heroStatistics: {
        id: 0,
        popularity: 0,
        ranking: 0,
      },
    };
    return hero;
  }

  // Método para verificar si el héroe ya existe
  private checkHeroExists(name: string) {
    return this.heroService.checkHeroExists(name);
  }

  // Método para configurar notificaciones
  private setNotification(
    message: string,
    type: 'success' | 'error' = 'success'
  ) {
    console.log('');

    this.notificationMessage = message;
    this.notificationType = type;

    if (this.notificationTimeout) {
      clearInterval(this.notificationTimeout);
    }

    this.notificationTimeout = setTimeout(() => {
      this.notificationMessage = '';
    }, 5000);
  }

  goBack() {
    return this.location.back();
  }
  // En el componente padre
  getPublisherControl(): FormControl<number> {
    return this.heroForm.get('comicPublishers') as FormControl<number>;
  }

  log(message: Message) {
    this.messageService.add(message);
  }

  closeNotification(arg0: any) {
    this.notificationMessage = '';
    console.log('notify child');
  }
}
