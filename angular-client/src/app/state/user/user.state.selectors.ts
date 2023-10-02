import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { User } from 'src/app/models/user/user';
import { isEqual } from 'lodash';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export const userSelector = (
  userState$: Observable<UserState>
): Observable<User> =>
  userState$.pipe(
    map(state => state.user),
    distinctUntilChanged(isEqual)
  );

export const isLoadingSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged()
  );

export const userOnlineSelector = (
  user$: Observable<User | null>
): Observable<boolean | null> =>
  user$.pipe(
    map(user => (user ? user.online : null)),
    distinctUntilChanged()
  );

export const userInboundFriendRequestsSelector = (
  user$: Observable<User | null>
): Observable<FriendRequest[] | null> =>
  user$.pipe(
    map(user => (user ? user.inboundFriendRequests : null)),
    distinctUntilChanged(isEqual)
  );

export const userOutboundFriendRequestsSelector = (
  user$: Observable<User | null>
): Observable<FriendRequest[] | null> =>
  user$.pipe(
    map(user => (user ? user.outboundFriendRequests : null)),
    distinctUntilChanged(isEqual)
  );
