import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { isEqual } from 'lodash';
import { User } from './user.model';
import { OnlineStatus } from 'src/app/models/online-status/online-status';

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

export const onlineStatusSelector = (
  user$: Observable<User | null>
): Observable<OnlineStatus | null> =>
  user$.pipe(
    map(user => (user ? user.onlineStatus : null)),
    distinctUntilChanged()
  );
