import { CommonModule, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SpinnerService } from './service/spinner.service';
import { Observable } from 'rxjs';
import { LoadingState } from './interface/loading-state';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [NgIf, CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
})
export class SpinnerComponent {
  public isSpinnerVisible$: Observable<LoadingState>;

  @Input() isLoading: boolean = false;
  @Input() message: string = 'Cargando...';

  // Default properties
  constructor(private spinnerService: SpinnerService) {
    this.isSpinnerVisible$ = spinnerService.spinnerState$;
  }

  setMessage(message: string) {
    this.spinnerService.setMessage(message);
  }
}
