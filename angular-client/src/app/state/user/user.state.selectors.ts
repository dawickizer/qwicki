import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { User } from 'src/app/models/user/user';
import { DecodedJwt } from 'src/app/models/decoded-jwt/decoded-jwt';
import { Friend } from 'src/app/models/friend/friend';
import { isEqual } from 'lodash';
import { FriendRequest } from 'src/app/models/friend-request/friend-request';

export const jwtSelector = (
  userState$: Observable<UserState>
): Observable<string> =>
  userState$.pipe(
    map(state => state.jwt),
    distinctUntilChanged()
  );

export const userSelector = (
  userState$: Observable<UserState>
): Observable<User> =>
  userState$.pipe(
    map(state => state.user),
    distinctUntilChanged(isEqual)
  );

export const decodedJwtSelector = (
  userState$: Observable<UserState>
): Observable<DecodedJwt> =>
  userState$.pipe(
    map(state => state.decodedJwt),
    distinctUntilChanged(isEqual)
  );

export const isLoggedInSelector = (
  userState$: Observable<UserState>
): Observable<boolean> =>
  userState$.pipe(
    map(state => state.isLoggedIn),
    distinctUntilChanged()
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

export const userFriendsSelector = (
  user$: Observable<User | null>
): Observable<Friend[] | null> =>
  user$.pipe(
    map(user => (user ? user.friends : null)),
    distinctUntilChanged(isEqual)
  );

export const userOnlineFriendsSelector = (
  user$: Observable<User | null>
): Observable<Friend[] | null> =>
  user$.pipe(
    map(user => (user ? user.onlineFriends : null)),
    distinctUntilChanged(isEqual)
  );

export const userOfflineFriendsSelector = (
  user$: Observable<User | null>
): Observable<Friend[] | null> =>
  user$.pipe(
    map(user => (user ? user.offlineFriends : null)),
    distinctUntilChanged(isEqual)
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
