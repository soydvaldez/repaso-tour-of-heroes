import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Message } from '../../interface/message';
import { SpinnerService } from '../../../spinner/service/spinner.service';
import { SpinnerComponent } from '../../../spinner/spinner.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, UpperCasePipe, SpinnerComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.scss',
})
export class MessagesComponent implements OnInit {
  title: string = 'History Messages';
  messages: Message[] = [];
  messages$: Observable<Message[]>;

  isLoading: boolean = false;
  message: string = 'Loading Messages...';

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  type: 'info' | 'warning' | 'error' = 'info';

  constructor(
    public messageService: MessageService,
    public spinnerService: SpinnerService
  ) {
    this.messages$ = this.messageService.messages$;
    this.messages$.pipe(
      map((message) => {
        return message && message.length > 0;
      })
    );
  }

  ngOnInit(): void {
    this.isLoading = true;

    this.messages$.subscribe((message) => {
      this.messages = message;
      this.messages.forEach((m) => {
        this.type = this.setSeverityStyle(m.severity);
      });
    });

    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  clear() {
    this.messageService.clear();
  }

  publishMessage() {
    this.messageService.add({
      source: 'MessageComponent',
      message: 'new message has been publish!',
      severity: 'INFO',
    });
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Error al desplazar el scroll:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Asegura que el scroll esté siempre al final después de cada cambio en la vista
  }

  // El componente message debe de tener su propio estado <p><span></span></p>
  // Ahorita el type coordina el estado en todos los <span></span>
  setSeverityStyle(severity: string = 'INFO'): 'info' | 'warning' | 'error' {
    if (severity === 'INFO') {
      return 'info';
    }

    if (severity === 'WARNING') {
      return 'warning';
    }

    return 'error';
  }
}
