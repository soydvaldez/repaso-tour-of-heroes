import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../../service/message.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Message } from '../../interface/message';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
})
export class MessagesComponent implements OnInit {
  title: string = 'messages';
  messages: string[] = [];
  messages$: Observable<Message[]>;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(public messageService: MessageService) {
    this.messages$ = messageService.messages$;
  }

  ngOnInit(): void {
    // this.getMessage();
  }

  clear() {
    // Manda a limpiear en el servicio
    this.messageService.clear();
    //Actualiza los mensajes
  }

  publishMessage() {
    this.messageService.add({
      source: 'MessageComponent',
      message: 'new message has been publish!',
      severity: 'INFO'
    });
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop =
        this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error al desplazar el scroll:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom(); // Asegura que el scroll esté siempre al final después de cada cambio en la vista
  }
}
