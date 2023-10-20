import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FriendState } from './friend.state';
import { isEqual } from 'lodash';
import { Friend } from './friend.model';

export const isLoadingSelector = (
  friendState$: Observable<FriendState>
): Observable<boolean> =>
  friendState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const friendsSelector = (
  friendState$: Observable<FriendState>
): Observable<Friend[] | null> =>
  friendState$.pipe(
    map(state => state.friends),
    distinctUntilChanged(isEqual)
  );

export const onlineFriendsSelector = (
  friends$: Observable<Friend[] | null>
): Observable<Friend[] | null> =>
  friends$.pipe(
    map(friends => friends.filter(friend => friend.online)),
    distinctUntilChanged(isEqual)
  );

export const offlineFriendsSelector = (
  friends$: Observable<Friend[] | null>
): Observable<Friend[] | null> =>
  friends$.pipe(
    map(friends => friends.filter(friend => !friend.online)),
    distinctUntilChanged(isEqual)
  );
