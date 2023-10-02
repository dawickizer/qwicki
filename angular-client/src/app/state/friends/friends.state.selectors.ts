import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { FriendsState } from './friends.state';
import { Friend } from 'src/app/models/friend/friend';
import { isEqual } from 'lodash';

export const isLoadingSelector = (
  friendsState$: Observable<FriendsState>
): Observable<boolean> =>
  friendsState$.pipe(
    map(state => state.isLoading),
    distinctUntilChanged(isEqual)
  );

export const friendsSelector = (
  friendsState$: Observable<FriendsState>
): Observable<Friend[] | null> =>
  friendsState$.pipe(
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
