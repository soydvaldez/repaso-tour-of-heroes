import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../interface/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  private messagesSubject = new Subject<Message[]>();
  messages$ = this.messagesSubject.asObservable();

  constructor() {}

  add(message: Message): void {
    this.messages.push(message);
    this.messagesSubject.next(this.messages);
  }

  clear(): void {
    this.messages = [];
    this.messagesSubject.next(this.messages);
  }
}
