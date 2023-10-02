import { Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { UserState } from './user.state';
import { User } from 'src/app/models/user/user';
import { isEqual } from 'lodash';

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
