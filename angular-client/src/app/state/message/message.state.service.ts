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
  messagesByFriendId$(
    friendId: string
  ): Observable<Map<string, Message[]> | null> {
    return messagesByFriendIdSelector(this.messages$, friendId);
  }

  setInitialState() {
    this._messageState.next(initialState);
  }

  setIsLoading(isLoading: boolean): void {
    const currentState = this._messageState.value;
    this._messageState.next({ ...currentState, isLoading });
  }

  setMessages(messages: Map<string, Map<string, Message[]>>): void {
    const clonedMessages = new Map();
    messages.forEach((value, key) => {
      clonedMessages.set(key, new Map(value.entries()));
    });
    const currentState = this._messageState.value;
    this._messageState.next({ ...currentState, messages: clonedMessages });
  }

  removeMessagesFromFriend(friend: Friend): void {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    updatedMessages.delete(friend._id);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  setFriendMessages(friend: Friend, messages: Map<string, Message[]>) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    const clonedInnerMessages = new Map(messages.entries());
    updatedMessages.set(friend._id, clonedInnerMessages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  addMessageToFriend(friend: Friend, message: Message) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    const currentFriendMessages = updatedMessages.get(friend._id);
    const dateKeyMessages = currentFriendMessages
      ? new Map(currentFriendMessages)
      : new Map<string, Message[]>();
    const date = new Date(message.createdAt);
    const dateKey = this.getDateKey(date);
    const currentMessages = dateKeyMessages.get(dateKey)
      ? [...dateKeyMessages.get(dateKey)]
      : [];
    const combinedMessages = [...currentMessages, message];
    dateKeyMessages.set(dateKey, combinedMessages);
    updatedMessages.set(friend._id, dateKeyMessages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  updateFriendMessages(friend: Friend, updatedMessagesArray: Message[]) {
    const currentState = this._messageState.value;
    const updatedMessages = new Map(currentState.messages);
    const currentFriendMessages = new Map(
      updatedMessages.get(friend._id) || []
    );

    for (const updatedMessage of updatedMessagesArray) {
      const dateKey = this.getDateKey(new Date(updatedMessage.createdAt));
      const dateMessages = currentFriendMessages.get(dateKey) || [];
      const messageIndex = dateMessages.findIndex(
        message => message._id === updatedMessage._id
      );

      if (messageIndex !== -1) {
        const clonedDateMessages = [...dateMessages];
        clonedDateMessages[messageIndex] = updatedMessage;
        currentFriendMessages.set(dateKey, clonedDateMessages);
      }
    }

    updatedMessages.set(friend._id, currentFriendMessages);
    this._messageState.next({ ...currentState, messages: updatedMessages });
  }

  groupMessagesByDate(messages: Message[]): Map<string, Message[]> {
    const grouped: Map<string, Message[]> = new Map();

    for (const message of messages) {
      const date = new Date(message.createdAt);
      const dateKey = this.getDateKey(date);
      const currentMessagesForDate = grouped.get(dateKey) || [];
      currentMessagesForDate.push(message);
      grouped.set(dateKey, currentMessagesForDate);
    }

    // Convert the map to an array
    const entries = [...grouped.entries()];

    // Sort the array based on the date keys
    entries.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);
      return dateA.getTime() - dateB.getTime(); // For ascending order
    });

    // Create a new map from the sorted array
    const sortedGrouped = new Map(entries);

    return sortedGrouped;
  }

  private getDateKey(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }
}
