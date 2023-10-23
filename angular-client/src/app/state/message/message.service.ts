import { Injectable } from '@angular/core';
import { MessageStateService } from './message.state.service';
import { MessageEffectService } from './message.effect.service';
import { Message } from './message.model';
import { Observable } from 'rxjs';
import { User } from '../user/user.model';
import { Friend } from '../friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  get messageState$() {
    return this.messageStateService.messageState$;
  }

  get isLoading$() {
    return this.messageStateService.isLoading$;
  }

  get messages$() {
    return this.messageStateService.messages$;
  }

  constructor(
    private messageEffectService: MessageEffectService,
    private messageStateService: MessageStateService
  ) {}

  getAllBetween(user: User, friend: Friend): Observable<Message[]> {
    return this.messageEffectService.getAllBetween(user, friend);
  }

  send(user: User, friend: Friend, message: Message): Observable<Message> {
    return this.messageEffectService.send(user, friend, message);
  }

  getUnviewedCountBetween(
    user: User,
    friend: Friend
  ): Observable<{ count: number }> {
    return this.messageEffectService.getUnviewedCountBetween(user, friend);
  }

  markAsViewed(user: User, friend: Friend): Observable<boolean> {
    return this.messageEffectService.markAsViewed(user, friend);
  }

  setInitialState(): void {
    this.messageStateService.setInitialState();
  }

  setMessages(messages: Map<string, Message[]>): void {
    this.messageStateService.setMessages(messages);
  }
}
