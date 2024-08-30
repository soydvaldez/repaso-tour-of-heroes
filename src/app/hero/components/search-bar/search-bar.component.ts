import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeroService } from '../../service/hero.service';
import { Observable, Subject } from 'rxjs';
import { CommonModule, NgFor } from '@angular/common';
import { Hero } from '../../interface/hero';
import { SpinnerComponent } from '../../../spinner/spinner.component';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { SearchBarService } from '../../service/search-bar.service';

interface Criteria {
  id: number | null;
  name: string | null;
}

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, NgFor, CommonModule, SpinnerComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.scss',
})
export class SearchBarComponent implements OnInit {
  searchCriteria$ = new Subject<Criteria>();
  public searchTerm: string = '';
  items$?: Observable<Hero[]>;
  value: any;

  isLoadingSpinner: boolean = false;
  spinnerMessage: string = '';

  constructor(
    private heroService: HeroService,
    private spinnerService: SpinnerService,
    private searchBarService: SearchBarService
  ) {}

  ngOnInit(): void {
    this.searchTerm = this.searchBarService.getSearchText();
  }

  filterHeroes(event: Event) {
    // this.spinnerService.setMessage('search hero');
    // this.spinnerService.show();

    this.isLoadingSpinner = true;
    this.spinnerMessage = 'search hero';

    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value;
    this.heroService.filterHeroes(this.searchTerm);
    this.searchBarService.setSearchText(this.searchTerm);
  }

  onEscape() {
    this.spinnerService.setMessage('Fetched all heroes...');
    this.spinnerService.show();
    this.heroService.restoreState();
  }

  // Devolver lo que estaba anteriormente
  onEnter(event: Event) {
    this.spinnerService.setMessage('search hero');
    this.spinnerService.show();
    if (this.searchTerm) {
      const inputElement = event.target as HTMLInputElement;
      this.heroService.filterHeroes(inputElement.value);
    }
  }
}
