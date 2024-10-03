import { NgClass, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success'; // Definir tipo de notificación

  @Output('closeNotificationEvent') closeNotificationEvent =
    new EventEmitter<string>();
  p: any;

  ngOnInit(): void {
    console.log('');
    
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   this.message = changes['message'].currentValue;
  //   this.type = changes['type'].currentValue;

  //   if (!this.isVisible && this.message != '') {
  //     this.isVisible = true;
  //   }

  //   if (this.p) {
  //     clearTimeout(this.p);
  //   }

  //   this.p = setTimeout(() => {
  //     if (this.isVisible) {
  //       this.isVisible = false;
  //       // this.message = '';
  //     }
  //   }, 1000);
  // }

  close() {
    this.message = '';
    this.closeNotificationEvent.emit('');
  }
}
