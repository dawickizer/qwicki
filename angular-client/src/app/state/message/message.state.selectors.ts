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
): Observable<Map<string, Map<string, Message[]>> | null> =>
  messageState$.pipe(
    map(state => state.messages),
    distinctUntilChanged(isEqual)
  );

export const messagesByFriendIdSelector = (
  messages$: Observable<Map<string, Map<string, Message[]>> | null>,
  friendId: string
): Observable<Map<string, Message[]> | null> =>
  messages$.pipe(
    map(messages => {
      if (messages) {
        const messagesForFriend = messages.get(friendId);
        return messagesForFriend ? new Map(messagesForFriend.entries()) : null;
      }
      return null;
    }),
    distinctUntilChanged(isEqual)
  );

export const unviewedCountSelector = (
  messages$: Observable<Map<string, Map<string, Message[]>> | null>
): Observable<number> =>
  messages$.pipe(
    map(messages => {
      if (messages) {
        let totalUnviewed = 0;
        messages.forEach((dateMessagesMap, friendId) => {
          dateMessagesMap.forEach(messagesArray => {
            totalUnviewed += messagesArray.filter(
              msg => !msg.viewed && msg.from._id === friendId
            ).length;
          });
        });
        return totalUnviewed;
      }
      return 0;
    }),
    distinctUntilChanged(isEqual)
  );

export const unviewedCountByFriendIdSelector = (
  messages$: Observable<Map<string, Message[]> | null>,
  friendId: string
): Observable<number> =>
  messages$.pipe(
    map(dateMessagesMap => {
      let friendUnviewed = 0;
      dateMessagesMap?.forEach(messagesArray => {
        friendUnviewed += messagesArray.filter(
          msg => !msg.viewed && msg.from._id === friendId
        ).length;
      });
      return friendUnviewed;
    }),
    distinctUntilChanged(isEqual)
  );

export const unviewedMessagesSelector = (
  messages$: Observable<Map<string, Map<string, Message[]>> | null>
): Observable<Message[]> =>
  messages$.pipe(
    map(messages => {
      const allUnviewed: Message[] = [];
      if (messages) {
        messages.forEach((dateMessagesMap, friendId) => {
          dateMessagesMap.forEach(messagesArray => {
            const unviewedForFriend = messagesArray.filter(
              msg => !msg.viewed && msg.from._id === friendId
            );
            allUnviewed.push(...unviewedForFriend);
          });
        });
      }
      return allUnviewed;
    }),
    distinctUntilChanged(isEqual)
  );

export const unviewedMessagesByFriendIdSelector = (
  messages$: Observable<Map<string, Message[]> | null>,
  friendId: string
): Observable<Message[]> =>
  messages$.pipe(
    map(dateMessagesMap => {
      const unviewed: Message[] = [];
      dateMessagesMap?.forEach(messagesArray => {
        const unviewedForDate = messagesArray.filter(
          msg => !msg.viewed && msg.from._id === friendId
        );
        unviewed.push(...unviewedForDate);
      });
      return unviewed;
    }),
    distinctUntilChanged(isEqual)
  );
