import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Hero } from '../../interface/hero';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from '../../../commons/tooltip.directive';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ConfirmModalComponent } from '../../../commons/confirm-modal/confirm-modal.component';
import { TopHeroService } from '../../service/tophero.service';
import { HeroesService } from '@data/rest/supabase/heroes/heroes-data.service';

@Component({
  selector: 'app-dashboard-hero-details',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TooltipDirective,
    SpinnerComponent,
    ConfirmModalComponent,
    CommonModule,
  ],
  templateUrl: './dashboard-hero-details.component.html',
  styleUrl: './dashboard-hero-details.component.scss',
})
export class DashboardHeroDetailsComponent implements OnInit, OnDestroy {
  @Input() renderHeroDetail!: number;
  @Input() selectedHero?: Hero;

  hero?: Hero = undefined;
  hasHero: any;
  subcription?: Subscription = undefined;

  isLoadingSpinner: boolean = false;
  messageSpinner: string = 'Loading hero details';
  showModal: boolean = false;

  isDeleted: boolean = false;
  @Output() onDeleteHero = new EventEmitter<boolean>(false);
  @Output() onEditHero = new EventEmitter<boolean>(false);

  constructor(private supabaseService: HeroesService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const renderHeroDetail = changes['selectedHero'];
    this.isLoadingSpinner = true;

    const selectedHero: Hero = changes['selectedHero'].currentValue;

    if (selectedHero) {
      this.hero = this.selectedHero;
      this.isLoadingSpinner = false;
      return;
    }
  }

  displayConfirmModal() {
    this.showModal = true;
  }

  handleConfirmation(confirm: boolean) {
    this.showModal = false;

    if (!confirm) {
      return;
    }

    if (this.hero && this.hero != undefined) {
      this.supabaseService
        .deleteHero(this.hero?.id)
        .subscribe((isHeroDeleted) => {
          if (isHeroDeleted) {
            this.onDeleteHero.emit(true);
            this.isDeleted = true;
          }
          setTimeout(() => {
            this.isDeleted = false;
            this.hero = undefined;
          }, 2000);
        });
    }
  }

  // Si elimina actualiza la lista topheroes
}
