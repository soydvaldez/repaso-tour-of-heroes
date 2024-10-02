import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { HeroService } from '../../service/hero.service';
import { Hero } from '../../interface/hero';
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard-hero-details',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './dashboard-hero-details.component.html',
  styleUrl: './dashboard-hero-details.component.scss',
})
export class DashboardHeroDetailsComponent implements OnInit, OnDestroy {
  @Input() renderHeroDetail!: number;
  hero?: Hero = undefined;
  hasHero: any;
  subcription?: Subscription = undefined;

  constructor(private heroService: HeroService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subcription) {
      this.subcription.unsubscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const renderHeroDetail = changes['renderHeroDetail'];

    if (renderHeroDetail.currentValue === -1) {
      this.hero = undefined;
      return;
    }

    if (renderHeroDetail && renderHeroDetail.currentValue != undefined) {
      const heroId = renderHeroDetail.currentValue;

      this.subcription = this.heroService.getHero(heroId).subscribe((hero) => {
        this.hero = hero;
      });
    }
  }
}
