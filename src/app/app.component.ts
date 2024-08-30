import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HeroComponent } from './hero/components/hero/hero.component';
import { MessagesComponent } from './messages/components/messages/messages.component';
import { ActionsComponent } from './actions/actions.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeroComponent,
    RouterLink,
    MessagesComponent,
    ActionsComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Tour of Heroes';

  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/dashboard']);
  }
}
