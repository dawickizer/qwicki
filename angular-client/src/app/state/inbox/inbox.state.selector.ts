import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { InboxState } from './inbox.state';
import { Room } from 'colyseus.js';
import { isEqual } from 'lodash';

export const isLoadingSelector = (
  inboxState$: Observable<InboxState>
): Observable<boolean> =>
  inboxState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const personalInboxSelector = (
  inboxState$: Observable<InboxState>
): Observable<Room> =>
  inboxState$.pipe(
    map(state => state.personalInbox),
    distinctUntilChanged(isEqual)
  );

export const connectedInboxesSelector = (
  inboxState$: Observable<InboxState>
): Observable<Room[]> =>
  inboxState$.pipe(
    map(state => state.connectedInboxes),
    distinctUntilChanged(isEqual)
  );

export const friendsInboxesSelector = (
  inboxState$: Observable<InboxState>
): Observable<Room[]> =>
  inboxState$.pipe(
    map(state =>
      state.connectedInboxes.filter(
        connectedInbox => connectedInbox.id !== state.personalInbox?.id
      )
    ),
    distinctUntilChanged(isEqual)
  );
