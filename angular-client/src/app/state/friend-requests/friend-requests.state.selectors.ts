import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FriendRequestsState } from './friend-requests.state';
import { isEqual } from 'lodash';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export const isLoadingSelector = (
  friendsState$: Observable<FriendRequestsState>
): Observable<boolean> =>
  friendsState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const inboundFriendRequestsSelector = (
  friendsState$: Observable<FriendRequestsState>
): Observable<FriendRequest[] | null> =>
  friendsState$.pipe(
    map(state => state.inboundFriendRequests),
    distinctUntilChanged(isEqual)
  );

export const outboundFriendRequestsSelector = (
  friendsState$: Observable<FriendRequestsState>
): Observable<FriendRequest[] | null> =>
  friendsState$.pipe(
    map(state => state.outboundFriendRequests),
    distinctUntilChanged(isEqual)
  );
