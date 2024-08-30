import { CommonModule, NgIf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SpinnerService } from './service/spinner.service';
import { Observable } from 'rxjs';
import { LoadingState } from './interface/loading-state';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css',
})
export class SpinnerComponent implements OnInit {
  loading$: Observable<LoadingState>;

  constructor(private spinnerService: SpinnerService) {
    this.spinnerService.setMessage('renderizando...');
    this.spinnerService.show();
    this.loading$ = spinnerService.loading$;
  }

  ngOnInit(): void {
    // this.spinnerService.setMessage('Cargando...');
  }

  setMessage(message: string) {
    this.spinnerService.setMessage(message);
  }
}
