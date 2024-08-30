import { Routes } from '@angular/router';
import { HeroComponent } from './hero/components/hero/hero.component';
import { HeroDetailComponent } from './hero/components/hero-detail/hero-detail.component';
import { DashboardComponent } from './hero/components/dashboard/dashboard.component';
import { NotFoundComponent } from './notfound/not-found.component';
import { HeroFormComponent } from './hero/components/hero-form/hero-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'detail/:id', component: HeroDetailComponent },
  { path: 'heroes', component: HeroComponent },
  { path: 'heroes/new', component: HeroFormComponent },
  { path: '**', component: NotFoundComponent },
];
