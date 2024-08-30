import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchBarService {
  private searchText: string = '';
  constructor() {}

  setSearchText(text: string) {
    this.searchText = text;
  }

  getSearchText(): string {
    return this.searchText;
  }
}
