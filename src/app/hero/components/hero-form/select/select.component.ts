import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Publisher } from '../../../interface/hero';
import { PublisherService } from '../service/publisher.service';
import { delay, Observable, Subscription, tap } from 'rxjs';
import { SpinnerComponent } from '../../../../spinner/spinner.component';
import { SpinnerService } from '../../../../spinner/service/spinner.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SpinnerComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
})
export class SelectComponent implements OnInit, OnDestroy {
  @Input() control!: FormControl<number>;
  publisherList: Publisher[] = [];

  publisherSelected: number = 1;

  publisherNotify$!: Observable<Publisher[]>;
  publishers$!: Observable<Publisher[]>;

  publishers?: Publisher[];
  subscription!: Subscription;

  constructor(
    private publisherService: PublisherService,
    private spinnerService: SpinnerService
  ) {}

  ngOnInit(): void {
    this.spinnerService.setMessage('');
    this.spinnerService.show();
    // this.publisherNotify$ = this.publisherService.publisher$;

    // this.publishers$ =
    this.subscription = this.publisherService
      .getPublishers()
      .pipe(
        delay(500),
        tap((publishers) => {
          this.publisherList = publishers;
        })
      )
      .subscribe((publishers) => {
        this.publisherList = publishers;
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  notifyChangeValue(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedId = Number(selectElement.value);
    if (selectedId) {
      const selectedPublisher = this.publishers?.find(
        (p) => p.id === selectedId
      );
      if (selectedPublisher) {
        this.publisherService.setPublisher(selectedPublisher);
      }
    }
  }
}
