import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { MessageState } from './message.state';
import { isEqual } from 'lodash';
import { Message } from './message.model';

export const isLoadingSelector = (
  messageState$: Observable<MessageState>
): Observable<boolean> =>
  messageState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const messagesSelector = (
  messageState$: Observable<MessageState>
): Observable<Map<string, Message[]> | null> =>
  messageState$.pipe(
    map(state => state.messages),
    distinctUntilChanged(isEqual)
  );

// Usage: const friendMessages$ = messagesByFriendIdSelector(this.messageStateService.messages$, friendId);
export const messagesByFriendIdSelector = (
  messages$: Observable<Map<string, Message[]> | null>,
  friendId: string
): Observable<Message[] | null> =>
  messages$.pipe(
    map(messages => {
      if (messages) {
        const messagesForFriend = messages.get(friendId);
        return messagesForFriend ? [...messagesForFriend] : null;
      }
      return null;
    }),
    distinctUntilChanged(isEqual)
  );
