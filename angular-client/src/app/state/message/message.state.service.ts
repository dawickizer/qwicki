import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageState, initialState } from './message.state';
import {
  isLoadingSelector,
  messagesSelector,
  messagesByFriendIdSelector,
} from './message.state.selectors';
import { Message } from './message.model';
import { Friend } from '../friend/friend.model';

@Injectable({
  providedIn: 'root',
})
export class MessageStateService {
  private _messageState = new BehaviorSubject<MessageState>(initialState);

  public messageState$: Observable<MessageState> =
    this._messageState.asObservable();
  public isLoading$ = isLoadingSelector(this.messageState$);
  public messages$ = messagesSelector(this.messageState$);

  // expose the dynamic selector since the above pattern cannot be followed
  messagesByFriendId$(friendId: string): Observable<Message[] | null> {
    return messagesByFriendIdSelector(this.messages$, friendId);
  }

  setInitialState() {
    this._messageState.next(initialState);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._messageState.value;
    this._messageState.next({ ...currentState, isLoading });
  }

  setMessages(messages: Map<string, Message[]>): void {
    const currentState = this._messageState.value;
    this._messageState.next({ ...currentState, messages });
  }

  setFriendMessages(friend: Friend, messages: Message[]) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    updatedMessages.set(friend._id, messages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  addMessagesToFriend(friend: Friend, messages: Message[]) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    const currentMessages = updatedMessages.get(friend._id) || [];
    const combinedMessages = [...currentMessages, ...messages];
    updatedMessages.set(friend._id, combinedMessages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  addMessageToFriend(friend: Friend, message: Message) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    const currentMessages = updatedMessages.get(friend._id) || [];
    const combinedMessages = [...currentMessages, message];
    updatedMessages.set(friend._id, combinedMessages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }
}
