import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FriendRequestState } from './friend-request.state';
import { isEqual } from 'lodash';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export const isLoadingSelector = (
  friendState$: Observable<FriendRequestState>
): Observable<boolean> =>
  friendState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const inboundFriendRequestsSelector = (
  friendState$: Observable<FriendRequestState>
): Observable<FriendRequest[] | null> =>
  friendState$.pipe(
    map(state => state.inboundFriendRequests),
    distinctUntilChanged(isEqual)
  );

export const outboundFriendRequestsSelector = (
  friendState$: Observable<FriendRequestState>
): Observable<FriendRequest[] | null> =>
  friendState$.pipe(
    map(state => state.outboundFriendRequests),
    distinctUntilChanged(isEqual)
  );
