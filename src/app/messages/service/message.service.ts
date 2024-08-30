import { Injectable } from '@angular/core';
import { delay, Subject, tap } from 'rxjs';
import { Message } from '../interface/message';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new Subject<Message[]>();
  messages$ = this.messagesSubject.asObservable();
  messages: Message[] = [];

  constructor() {
    this.filledMessage();
  }

  add(message: Message): void {
    this.messages.push(message);
    this.messagesSubject.next(this.messages);
  }

  clear(): void {
    this.messages = [];
    this.messagesSubject.next(this.messages);
  }

  filledMessage() {
    let message: Message[] = [
      {
        source: 'Testing',
        message: 'Testing message1',
      },
      {
        source: 'Testing',
        message: 'Testing message2',
      },
      {
        source: 'Testing',
        message: 'Testing message3',
      },
      {
        source: 'Testing',
        message: 'Testing message4',
      },
    ];
    this.messagesSubject.next(message);
  }
}
