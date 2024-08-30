import { Component, OnInit } from '@angular/core';
import { Hero } from '../../interface/hero';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../service/hero.service';
import { RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';

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
  ],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit {
  heroes: Hero[] = [];

  constructor(
    private heroService: HeroService,
    public spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes() {
    this.spinnerService.setMessage('Cargando heroe...');
    this.spinnerService.show();

    this.heroService.getHeroes().subscribe((heroes) => {
      this.spinnerService.hide();
      this.heroes = heroes;
    });
  }
}
