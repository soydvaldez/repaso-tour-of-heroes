import { Component, OnInit } from '@angular/core';
import { HeroService } from '../../service/hero.service';
import { Hero } from '../../interface/hero';
import { NgFor, NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  heroes?: Hero[];
  constructor(private heroService: HeroService) {}

  ngOnInit(): void {
    this.heroService.getHeroes().subscribe((heroes) => {
      this.heroes = heroes.splice(1, 4);
    });
  }
}
