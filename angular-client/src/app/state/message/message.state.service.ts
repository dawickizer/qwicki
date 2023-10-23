import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { MessageState, initialState } from './message.state';
import { isLoadingSelector, messagesSelector } from './message.state.selectors';
import { Message } from './message.model';

@Injectable({
  providedIn: 'root',
})
export class MessageStateService {
  private _messageState = new BehaviorSubject<MessageState>(initialState);

  public messageState$: Observable<MessageState> =
    this._messageState.asObservable();
  public isLoading$ = isLoadingSelector(this.messageState$);
  public messages$ = messagesSelector(this.messageState$);

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
}
