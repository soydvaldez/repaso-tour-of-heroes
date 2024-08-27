import { Component, OnInit } from '@angular/core';
import { Location, NgIf, UpperCasePipe } from '@angular/common';
import { HeroService } from '../../service/hero.service';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../../interface/hero';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [NgIf, FormsModule, UpperCasePipe],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css',
})
export class HeroDetailComponent implements OnInit {
  hero: Hero | undefined;

  constructor(
    private location: Location,
    private heroService: HeroService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id: number = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id).subscribe((hero) => {
      this.hero = hero;
    });
  }

  goBack(): void {
    this.location.back();
  }
}
