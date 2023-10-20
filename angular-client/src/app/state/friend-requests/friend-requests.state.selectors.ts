import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FriendRequestsState } from './friend-requests.state';
import { isEqual } from 'lodash';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export const isLoadingSelector = (
  friendState$: Observable<FriendRequestsState>
): Observable<boolean> =>
  friendState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const inboundFriendRequestsSelector = (
  friendState$: Observable<FriendRequestsState>
): Observable<FriendRequest[] | null> =>
  friendState$.pipe(
    map(state => state.inboundFriendRequests),
    distinctUntilChanged(isEqual)
  );

export const outboundFriendRequestsSelector = (
  friendState$: Observable<FriendRequestsState>
): Observable<FriendRequest[] | null> =>
  friendState$.pipe(
    map(state => state.outboundFriendRequests),
    distinctUntilChanged(isEqual)
  );
