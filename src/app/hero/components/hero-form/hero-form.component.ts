import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from '../../../messages/service/message.service';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { HeroService } from '../../service/hero.service';
import { SelectComponent } from './select/select.component';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { ActionsComponent } from '../../../actions/actions.component';
import { LoadingState } from '../../../spinner/interface/loading-state';
import {
  catchError,
  finalize,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
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

  years = [
    2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013,
    2012,
  ];

  defaultYear: number = 2024;
  publishers$!: Observable<Publisher[]>;

  btnText: string = 'Cancel';
  buttonColor: string = '#104781;';

  constructor(
    private messageService: MessageService,
    private spinnerService: SpinnerService,
    private heroService: HeroService,
    private publisherService: PublisherService,
    private location: Location,
    private actionsService: ActionsService
  ) {
    // Para ser notificado de cambios de estado
    this.spinnerState$ = this.spinnerService.spinnerState$;
    this.heroCreated$ = heroService.heroCreated$;
  }

  ngOnInit(): void {
    this.actionsService.setOptions(HeroActions.Create);

    this.publishers$ = this.publisherService.getPublishers();
    this.isLoadingSpinner = true;

    this.heroForm = new FormGroup({
      name: new FormControl<string>(''),
      year: new FormControl<number>(2024),
      publisher: new FormControl<number>(1),
    });

    this.messageService.add({
      severity: 'INFO',
      source: 'HeroFormComponent',
      message: 'Hero Form rendered',
    });

    setTimeout(() => {
      this.isLoadingSpinner = false;
    }, 1000);
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
    const publisherId = this.heroForm.get('publisher')?.value;

    if (!newHero.name) {
      this.notificationType = 'error';
      this.notificationMessage = 'Hero name is required';

      this.isLoadingSpinner = false;

      setTimeout(() => {
        this.notificationMessage = '';
      }, 5000);
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
        switchMap(() => this.publisherService.getPublisherById(publisherId)),
        tap((publisher) => {
          if (!publisher) {
            this.setNotification('Publisher no encontrado', 'error');
            throw new Error('Publisher no encontrado');
          }
          return publisher;
        }),
        switchMap((publisher) =>
          this.heroService.add({ ...newHero, publisher })
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
        setTimeout(() => {
          this.notificationMessage = '';
        }, 5000);
      });
  }

  // Método para crear un nuevo héroe a partir del formulario
  private createHero(): Hero {
    return {
      id: Math.floor(Math.random() * 1000), // Genera un ID ficticio o usa uno real si es necesario
      name: this.heroForm.get('name')?.value,
      year: this.heroForm.get('year')?.value,
      publisher: null, // Se asignará más tarde
    };
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
    this.notificationMessage = message;
    this.notificationType = type;
  }

  goBack() {
    return this.location.back();
  }
  // En el componente padre
  getPublisherControl(): FormControl<number> {
    return this.heroForm.get('publisher') as FormControl<number>;
  }

  log(message: Message) {
    this.messageService.add(message);
  }
}
