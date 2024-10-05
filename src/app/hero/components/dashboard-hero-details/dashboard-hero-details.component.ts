import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { HeroService } from '../../service/hero.service';
import { Hero } from '../../interface/hero';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { TooltipDirective } from '../../../commons/tooltip.directive';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { ConfirmModalComponent } from '../../../commons/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-dashboard-hero-details',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    TooltipDirective,
    SpinnerComponent,
    ConfirmModalComponent,
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

  @Output() heroDeleted = new EventEmitter<boolean>();

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const renderHeroDetail = changes['renderHeroDetail'];
    this.isLoadingSpinner = true;

    const selectedHero: Hero = changes['renderHeroDetail'].currentValue;

    if (selectedHero) {
      this.hero = this.selectedHero;
      this.isLoadingSpinner = false;
      return;
    }

    if (renderHeroDetail.currentValue === -1) {
      this.hero = undefined;
      this.isLoadingSpinner = false;
      return;
    }

    if (renderHeroDetail && renderHeroDetail.currentValue != undefined) {
      const heroId = renderHeroDetail.currentValue;

      this.subcription = this.heroService.getHero(heroId).subscribe((hero) => {
        this.isLoadingSpinner = false;
        this.hero = hero;
      });
    }
  }

  displayConfirmModal() {
    this.showModal = true;
  }

  handleConfirmation(confirm: boolean) {
    this.showModal = false;
    if (confirm) {
      if (this.hero != undefined) {
        this.heroService.delete(this.hero?.id).subscribe((isDeleted) => {
          this.heroDeleted.emit(true);
          console.log(isDeleted);
        });
      }
    }
  }

  // Si elimina actualiza la lista topheroes
}
