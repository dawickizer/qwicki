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

  messagesByFriendId$(friendId: string): Observable<Map<string, Message[]>> {
    return this.messageStateService.messagesByFriendId$(friendId);
  }

  constructor(
    private messageEffectService: MessageEffectService,
    private messageStateService: MessageStateService
  ) {}

  getAllBetween(
    user: User,
    friend: Friend
  ): Observable<Map<string, Message[]>> {
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

  markAsViewed(
    user: User,
    friend: Friend,
    messages: Message[]
  ): Observable<Message[]> {
    return this.messageEffectService.markAsViewed(user, friend, messages);
  }

  setInitialState(): void {
    this.messageStateService.setInitialState();
  }

  setMessages(messages: Map<string, Map<string, Message[]>>): void {
    this.messageStateService.setMessages(messages);
  }

  removeMessagesFromFriend(friend: Friend): void {
    this.messageStateService.removeMessagesFromFriend(friend);
  }

  updateFriendMessages(friend: Friend, messages: Message[]) {
    this.messageStateService.updateFriendMessages(friend, messages);
  }

  setFriendMessages(friend: Friend, messages: Map<string, Message[]>): void {
    this.messageStateService.setFriendMessages(friend, messages);
  }

  addMessageToFriend(friend: Friend, message: Message): void {
    this.messageStateService.addMessageToFriend(friend, message);
  }
}
